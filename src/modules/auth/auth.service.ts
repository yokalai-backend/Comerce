import errors from "../../core/errors/errors";
import { hashPassword, verifyPassword } from "../../core/utils/hash/hashing";
import { createUserRepository, loginUserRepository } from "./auth.repository";

export async function createUser(input: CreateUserInput) {
  const hashedPassword = await hashPassword(input.password);

  await createUserRepository({
    username: input.username,
    email: input.email,
    passwordHash: hashedPassword,
  });
}

export async function loginUser(input: LoginUserInput) {
  const user = await loginUserRepository(input);
  if (!user?.hash) throw errors.notFound("Password or email invalid");

  const verified = verifyPassword(input.password, user.hash);
  if (!verified) throw errors.authorized("Password or email invalid");
}
