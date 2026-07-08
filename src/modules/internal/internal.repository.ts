import { executeQuery, queryOne } from "../../core/utils/query/query";

export async function insertUserProfilesRepository(
  input: InsertUserProfilesInput,
) {
  return executeQuery(
    `INSERT INTO user_profiels (user_id, full_name, user_email) VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO NOTHING`,
    [input.userId, input.username, input.email],
  );
}

export async function findUseProfilerByIdRepository(userId: string) {
  return queryOne<{ user_id: string }>(
    `SELECT user_id FROM user_profiles WHERE user_id = $1`,
    [userId],
  );
}
