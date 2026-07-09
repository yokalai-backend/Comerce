import { DatabaseError } from "pg";
import { PG_UNIQUE_VIOLATION } from "../../constant";
import pool from "../../core/config/db";
import errors from "../../core/errors/errors";
import { executeQuery, queryOne } from "../../core/utils/query/query";

export async function getUserProfilesByIdRepository(userId: string) {
  return queryOne<UserProfilesRawDB>(
    `SELECT * FROM user_profiles WHERE user_id = $1`,
    [userId],
  );
}

export async function updateUserProfilesDetailsRepository(
  userId: string,
  input: UpdateUserProfilesDetailsInput,
) {
  const values = [userId];
  let query = [];
  let index = 1;

  if (input.fullName) {
    values.push(input.fullName);
    query.push(`full_name = $${++index}`);
  }

  if (input.avatarUrl) {
    values.push(input.avatarUrl);
    query.push(`avatar_url = $${++index}`);
  }

  if (input.phoneNumber) {
    values.push(input.phoneNumber);
    query.push(`phone_number = $${++index}`);
  }

  return queryOne<UserUpdatedProfilesRawDB>(
    `UPDATE user_profiles SET ${query.join(", ")}, updated_at = NOW() WHERE user_id = $1 RETURNING full_name, avatar_url, phone_number, updated_at`,
    values,
  );
}

export async function patchUserBirthDateRepository(
  userId: string,
  birthDate: Date,
) {
  return executeQuery(
    `
    UPDATE user_profiles SET birth_date = $1, birth_date_updated_at = NOW()
    WHERE user_id = $2 AND (birth_date_updated_at IS NULL OR birth_date_updated_at
    <= NOW() - INTERVAL '7 days')
    `,
    [birthDate, userId],
  );
}

export async function addUserAddresses(
  userId: string,
  input: addUserAddressesInput,
) {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    await client.query(
      `
      SELECT user_id
      FROM user_profiles
      WHERE user_id = $1
      FOR UPDATE
    `,
      [userId],
    );

    const addresses = await client.query<{ total: number }>(
      `
    SELECT COUNT(*) AS total FROM user_addresses WHERE user_id = $1
  `,
      [userId],
    );

    if (addresses.rows[0].total >= 3)
      throw errors.badRequest(
        "User addresses already reach maximum amount",
        "MAXIMUM_ADDRESS",
      );

    await client.query(
      `
    INSERT INTO user_addresses 
    (user_id, label, street_address, city, country, is_default) 
    VALUES($1, $2, $3, $4, $5, $6)
    `,
      [
        userId,
        input.label,
        input.streetAddress,
        input.city,
        input.country,
        input.asDefault,
      ],
    );

    await client.query(`COMMIT`);
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.code === PG_UNIQUE_VIOLATION)
        throw errors.badRequest(`Street address already exists`);
    }
    await client.query(`ROLLBACK`);

    throw error;
  } finally {
    client.release();
  }
}
