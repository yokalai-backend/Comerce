import { queryOne } from "../../core/utils/query/query";

interface RegisterProps {
  username: string;
  email: string;
  hashed: string;
}

export async function registerRepo(input: RegisterProps) {
  try {
    await queryOne(
      `INSERT INTO users (username, email, hash) VALUES ($1, $2, $3) RETURNING id`,
      [input.username, input.email, input.hashed],
    );
  } catch (error) {}
}
