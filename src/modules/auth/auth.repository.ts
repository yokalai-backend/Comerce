import { DatabaseError } from "pg";
import { PG_CHECK_VIOLATION, PG_UNIQUE_VIOLATION } from "../../constant";
import pool from "../../core/config/db";
import errors from "../../core/errors/errors";
import { executeQuery, queryOne } from "../../core/utils/query/query";

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

    if (deviceId) {
      console.log("DEVICE ID: ", deviceId);
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
    }

    const user = await client.query<UserRawDB>(
      `SELECT id, username, role, hash FROM users WHERE email = $1 AND is_active = true FOR UPDATE`,
      [input.email],
    );

    if (!user.rows[0]?.id)
      throw errors.unAuthorized("Password or email invalid");

    const connectedDevices = await client.query(
      `SELECT id FROM devices WHERE user_id = $1 FOR UPDATE`,
      [user.rows[0].id],
    );

    if (connectedDevices.rowCount && connectedDevices.rowCount >= 5)
      throw errors.badRequest(
        "Connected devices reach maximum",
        "CONNECTED_DEVICES_MAX",
      );

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

export async function getAccessPayloadByIdRepository(userId: string) {
  return queryOne<{ username: string; role: string }>(
    `SELECT username, role FROM users WHERE id = $1 AND is_active = true`,
    [userId],
  );
}

export async function insertTokenRepository(
  input: RefreshTokenInput,
  reason: RefreshedTokenReason,
  previousJti?: string,
) {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    if (previousJti) {
      await client.query<{ jti: string }>(
        `DELETE FROM refresh_tokens WHERE jti = $1 RETURNING jti`,
        [previousJti],
      );
    }

    const newRefreshToken = await client.query<{ jti: string }>(
      `INSERT INTO refresh_tokens (user_id, jti, device_id) VALUES ($1, $2, $3) RETURNING jti`,
      [input.id, input.jti, input.deviceId],
    );

    const newJti = newRefreshToken.rows[0].jti;

    await client.query(
      `INSERT INTO revoked_tokens (user_id, device_id, jti, prev_jti, ip_addr, revoke_reason) VALUES ($1, $2, $3, $4, $5, $6)`,
      [input.id, input.deviceId, newJti, previousJti, input.ipAddress, reason],
    );

    await client.query(`COMMIT`);
  } catch (error) {
    await client.query(`ROLLBACK`);

    if (error instanceof DatabaseError) {
      if (error.code === PG_UNIQUE_VIOLATION)
        throw errors.conflict("User already login", "ALREADY_LOGIN");
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function getTokenRepository(jti: string) {
  return queryOne<{ jti: string; device_id: string }>(
    `SELECT jti, device_id FROM refresh_tokens WHERE jti = $1`,
    [jti],
  );
}

export async function revokeTokenRepository(
  input: RefreshTokenInput,
  reason: RefreshedTokenReason,
) {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    await client.query(`DELETE FROM refresh_tokens WHERE jti = $1`, [
      input.jti,
    ]);

    if (input.deviceId) {
      await client.query(
        `INSERT INTO revoked_tokens (user_id, device_id, jti, ip_addr, revoke_reason) VALUES ($1, $2, $3, $4, $5)`,
        [input.id, input.deviceId, input.jti, input.ipAddress, reason],
      );
    }

    await client.query(`COMMIT`);
  } catch (error) {
    await client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}
