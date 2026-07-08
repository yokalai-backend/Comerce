import { executeQuery } from "../../core/utils/query/query";

export async function createUserProfilesRepository(
  input: createUserProfilesInput,
) {
  return executeQuery(
    `INSERT INTO user_profiels (user_id, full_name, user_email) VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO NOTHING`,
    [input.userId, input.username, input.email],
  );
}
