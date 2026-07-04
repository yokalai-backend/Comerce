import { DatabaseError } from "pg";
import { PG_UNIQUE_VIOLATION } from "../../constant";
import pool from "../../core/config/db";
import errors from "../../core/errors/errors";
import { executeQuery, queryOne } from "../../core/utils/query/query";

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

    const deleteCurrentToken = await client.query(
      `DELETE FROM refresh_tokens WHERE device_id = $1 RETURNING id`,
      [input.deviceId],
    );

    if (deleteCurrentToken.rowCount) {
      await client.query(
        `INSERT INTO revoked_tokens (user_id, device_id, revoke_reason) VALUES ($1, $2, 'refreshed')`,
        [input.id, input.deviceId],
      );
    }

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

export async function revokeTokenRepository(
  userId: string,
  deviceId: string,
  reason: RefreshTokenErrorReason,
) {
  if (!deviceId) throw errors.unAuthorized("Device not found");

  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    await client.query(`DELETE FROM refresh_tokens WHERE device_id = $1`, [
      deviceId,
    ]);
    await client.query(
      `INSERT INTO revoked_tokens (user_id, device_id, revoke_reason) VALUES ($1, $2, $3)`,
      [userId, deviceId, reason],
    );

    await client.query(`COMMIT`);
  } catch (error) {
    await client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}
