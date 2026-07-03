import { DatabaseError } from "pg";
import { queryOne } from "../../core/utils/query/query";
import errors from "../../core/errors/errors";
import pool from "../../core/config/db";

const PG_UNIQUE_VIOLATION = "23505";

export async function createUserRepository(input: CreateUserRepositoryInput) {
  try {
    await queryOne(
      `INSERT INTO users (username, email, hash) VALUES ($1, $2, $3) RETURNING id`,
      [input.username, input.email, input.passwordHash],
    );
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.code === PG_UNIQUE_VIOLATION)
        throw errors.conflict("Email already exists");
    }

    throw error;
  }
}

export async function loginUserRepository(input: LoginUserInput) {
  return queryOne<{ id: string; username: string; role: string; hash: string }>(
    `SELECT id, username, role, hash FROM users WHERE email = $1`,
    [input.email],
  );
}

export async function getUserById(userId: string) {
  return queryOne<{ username: string; role: string }>(
    `SELECT username, role FROM users WHERE id = $1 AND is_active = true`,
    [userId],
  );
}

export async function insertTokenRepository(input: RefreshTokenInput) {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    await client.query(`DELETE FROM refresh_tokens WHERE device_id = $1`, [
      input.deviceId,
    ]);

    await client.query(
      `INSERT INTO refresh_tokens (user_id, jti, device_id) VALUES ($1, $2, $3)`,
      [input.id, input.jti, input.deviceId],
    );

    await client.query(`COMMIT`);
  } catch (error) {
    await client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}

export async function deleteTokenRepository(deviceId: string) {
  return queryOne(
    `DELETE FROM refresh_tokens WHERE device_id = $1 AND is_revoked = false VALUES ($1, $2)`,
    [deviceId],
  );
}

type RefreshTokenErrorType = "rotated" | "security_issues" | "logout";

export async function updateTokenRepository(
  reason: RefreshTokenErrorType,
  jti: string,
) {
  await pool.query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW(),
         is_revoked = true,
         revoke_reason = $1
     WHERE jti = $2`,
    [reason, jti],
  );
}
