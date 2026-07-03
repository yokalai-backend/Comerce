import { DatabaseError } from "pg";
import { queryOne } from "../../core/utils/query/query";
import errors from "../../core/errors/errors";

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
  return queryOne<{ hash: string }>(`SELECT hash FROM users WHERE email = $1`, [
    input.email,
  ]);
}
