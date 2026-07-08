import { queryOne } from "../../core/utils/query/query";

export async function updateUserRepository(
  userId: string,
  value: { username: string | undefined; hashedPassword: string | undefined },
) {
  if (value.username && value.hashedPassword) {
    return queryOne(
      `UPDATE users SET username = $1, hash = $2 WHERE id = $3 AND is_active = true`,
      [value.username, value.hashedPassword, userId],
    );
  }

  if (value.username && !value.hashedPassword)
    return queryOne(
      `UPDATE users SET username = $1 WHERE id = $2 AND is_active = true`,
      [value.username, userId],
    );

  if (value.hashedPassword && !value.username)
    return queryOne(
      `UPDATE users SET hash = $1 WHERE id = $2 AND is_active = true`,
      [value.hashedPassword, userId],
    );
}

export async function getUserByIdRepository(userId: string) {
  return queryOne<UserSafeRawDB>(
    `SELECT username, role, email FROM users WHERE id = $1 AND is_a ctive = true`,
    [userId],
  );
}
