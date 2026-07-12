import { FastifyInstance } from "fastify";
import errors from "../../core/errors/errors";
import { hashPassword, verifyPassword } from "../../core/utils/hash/hashing";
import { executeQuery } from "../../core/utils/query/query";
import generateTokens from "../../core/utils/tokens/generate.tokens";
import {
  createUserRepository,
  getAccessPayloadByIdRepository,
  getTokenRepository,
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
  previousJti: string,
) {
  const user = await loginUserRepository(input, deviceInput, deviceId);

  const verified = await verifyPassword(input.password, user.hash);
  if (!verified) throw errors.unAuthorized("Password or email invalid");

  const insertTokenInput: InsertTokenInput = {
    id: user.id,
    ipAddress: deviceInput.ipAddr,
    deviceId,
  };

  const accessTokenInput: AccessTokenInput = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const generatedTokens = await generateTokens(
    insertTokenInput,
    accessTokenInput,
    "login",
    previousJti,
  );

  return generatedTokens;
}

export async function refreshToken(input: RefreshTokenInput) {
  if (!input.deviceId) throw errors.unAuthorized("Please login first");

  const currentRefreshToken = await getTokenRepository(input.jti);

  if (!currentRefreshToken) {
    await executeQuery(
      `INSERT INTO revoked_tokens (user_id, device_id, revoke_reason, jti, ip_addr) VALUES ($1, $2, $3, $4, $5)`,
      [input.id, input.deviceId, "reuse_attempt", input.jti, input.ipAddress],
    );

    throw errors.unAuthorized(
      "Invalid refresh token, please try to login again",
    );
  }

  if (currentRefreshToken.device_id !== input.deviceId) {
    await revokeTokenRepository(input, "device_mismatch");
    throw errors.unAuthorized("Device mismatch", "TOKEN_DEVICE_MISMATCH");
  }

  const user = await getAccessPayloadByIdRepository(input.id);

  if (!user) throw errors.notFound("User not found");

  const insertTokenInput: InsertTokenInput = {
    id: input.id,
    deviceId: input.deviceId,
    ipAddress: input.ipAddress,
  };

  const accessTokenInput: AccessTokenInput = {
    id: input.id,
    username: user.username,
    role: user.role,
  };

  return generateTokens(
    insertTokenInput,
    accessTokenInput,
    "refreshed",
    input.jti,
  );
}

export async function logout(
  previousJti: string,
  refreshTokenInput: RefreshTokenInput,
) {
  const exists = await getTokenRepository(previousJti);

  if (!exists)
    throw errors.unAuthorized("User already log out", "ALREADY_LOGOUT");

  await revokeTokenRepository(refreshTokenInput, "logout");
}
