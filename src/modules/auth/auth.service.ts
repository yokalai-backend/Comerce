import { FastifyInstance } from "fastify";
import { postData } from "../../core/api/api";
import errors from "../../core/errors/errors";
import { hashPassword, verifyPassword } from "../../core/utils/hash/hashing";
import { queryOne } from "../../core/utils/query/query";
import generateTokens from "../../core/utils/tokens/generate.tokens";
import {
  createUserRepository,
  getUserById,
  loginUserRepository,
  revokeTokenRepository,
} from "./auth.repository";

export async function createUser(input: CreateUserInput, f: FastifyInstance) {
  const hashedPassword = await hashPassword(input.password);

  const user = await createUserRepository({
    username: input.username,
    email: input.email,
    passwordHash: hashedPassword,
  });

  f.rabbitmq.channel.publish(
    "user_events",
    "user.created",
    Buffer.from(
      JSON.stringify({
        userId: user!.id,
        username: user!.username,
        email: user!.email,
      }),
    ),
    { persistent: true, messageId: user!.id },
  );
}

export async function loginUser(
  input: LoginUserInput,
  deviceInput: LoginDeviceInput,
  deviceId: string,
) {
  const user = await loginUserRepository(input, deviceInput, deviceId);

  if (!user?.id) throw errors.unAuthorized("Password or email invalid");

  const verified = verifyPassword(input.password, user.hash);
  if (!verified) throw errors.unAuthorized("Password or email invalid");

  const generatedTokens = await generateTokens(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      device_id: deviceId,
    },
    "logout",
  );

  return generatedTokens;
}

export async function refreshToken(input: RefreshTokenInput) {
  if (!input.deviceId) throw errors.unAuthorized("Please login first");

  const currentRefreshToken = await queryOne<{
    jti: string;
    device_id: string;
    is_revoked: boolean;
  }>(`SELECT jti, device_id, is_revoked FROM refresh_tokens WHERE jti = $1`, [
    input.jti,
  ]);

  if (!currentRefreshToken) {
    throw errors.unAuthorized(
      "Invalid refresh token, please try to login again",
    );
  } // EDGE CASES

  if (currentRefreshToken.is_revoked) {
    await revokeTokenRepository(input.id, input.deviceId, "security_issues");
    throw errors.unAuthorized("Token reuse detected", "TOKEN_REUSED");
  }

  if (currentRefreshToken.device_id !== input.deviceId) {
    await revokeTokenRepository(input.id, input.deviceId, "security_issues");
    throw errors.unAuthorized("Device mismatch", "TOKEN_DEVICE_MISMATCH");
  }

  const user = await getUserById(input.id);

  if (!user?.username) throw errors.notFound("User not found");

  return await generateTokens(
    {
      id: input.id,
      username: user.username,
      role: user.role,
      device_id: input.deviceId,
    },
    "refreshed",
  );
}
