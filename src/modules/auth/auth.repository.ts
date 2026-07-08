import { DatabaseError } from "pg";
import { PG_CHECK_VIOLATION, PG_UNIQUE_VIOLATION } from "../../constant";
import pool from "../../core/config/db";
import errors from "../../core/errors/errors";
import { queryOne } from "../../core/utils/query/query";

export async function createUserRepository(input: CreateUserRepositoryInput) {
  try {
    return await queryOne<{ id: string; username: string; email: string }>(
      `INSERT INTO users (username, email, hash) VALUES ($1, $2, $3) RETURNING id, username, email`,
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

export async function loginUserRepository(
  input: LoginUserInput,
  deviceInput: LoginDeviceInput,
  deviceId: string,
) {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const device = await client.query<{ id: string }>(
      `SELECT id FROM devices WHERE device_id = $1`,
      [deviceId],
    );

    if (device.rowCount) {
      const user = await client.query<UserRawDB>(
        `SELECT id, username, role, hash FROM users WHERE email = $1 AND is_active = true`,
        [input.email],
      );
      await client.query(`COMMIT`);
      return user.rows[0];
    }

    const user = await client.query<UserRawDB>(
      `SELECT id, username, role, hash FROM users WHERE email = $1 AND is_active = true FOR UPDATE`,
      [input.email],
    );

    const connectedDevices = await client.query(
      `SELECT id FROM devices WHERE user_id = $1 FOR UPDATE`,
      [user.rows[0].id],
    );

    if (connectedDevices.rowCount && connectedDevices.rowCount >= 5)
      throw errors.badRequest(
        "Connected devices reach maximum",
        "CONNECTED_DEVICES_MAX",
      );

    if (!user.rows[0]) {
      await client.query(`ROLLBACK`);
      throw errors.notFound("User not found", "USER_NOT_FOUND");
    }

    await client.query(
      `INSERT INTO devices (user_id, device_id, ip_addr, agent) VALUES ($1, $2, $3, $4)`,
      [user.rows[0].id, deviceId, deviceInput.ipAddr, deviceInput.deviceAgent],
    );

    await client.query(`COMMIT`);
    return user.rows[0];
  } catch (error) {
    await client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}

export async function getUserById(userId: string) {
  return queryOne<{ username: string; role: string }>(
    `SELECT username, role FROM users WHERE id = $1 AND is_active = true`,
    [userId],
  );
}

export async function insertTokenRepository(
  input: RefreshTokenInput,
  reason: RefreshTokenErrorReason,
) {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const deleteCurrentToken = await client.query(
      `DELETE FROM refresh_tokens WHERE device_id = $1 RETURNING id`,
      [input.deviceId],
    );

    if (deleteCurrentToken.rowCount) {
      await client.query(
        `INSERT INTO revoked_tokens (user_id, device_id, revoke_reason) VALUES ($1, $2, $3)`,
        [input.id, input.deviceId, reason],
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
