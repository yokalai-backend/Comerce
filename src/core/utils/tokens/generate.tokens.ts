import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import {
  ACCESS_TOKEN_EXPIRES_TIME,
  REFRESH_TOKEN_EXPIRES_TIME,
} from "../../../constant";
import { insertTokenRepository } from "../../../modules/auth/auth.repository";
import env from "../../config/env";

export default async function generateTokens(input: TokenInput) {
  const accessTokenPayload = {
    id: input.id,
    username: input.username,
    role: input.role,
  };

  const jti = randomUUID();

  const refreshTokenPayload = {
    id: input.id,
    jti,
  };

  const signedAccessToken = jwt.sign(accessTokenPayload, env.ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRES_TIME,
  });

  const signedRefreshToken = jwt.sign(refreshTokenPayload, env.REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRES_TIME,
  });

  await insertTokenRepository({ id: input.id, jti, deviceId: input.device_id });

  return { signedAccessToken, signedRefreshToken };
}
