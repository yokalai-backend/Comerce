import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import {
  ACCESS_TOKEN_EXPIRES_TIME,
  REFRESH_TOKEN_EXPIRES_TIME,
} from "../../../constant";
import { insertTokenRepository } from "../../../modules/auth/auth.repository";
import env from "../../config/env";

export default async function generateTokens(
  insertTokenInput: InsertTokenInput,
  accessTokenInput: AccessTokenInput,
  reason: RefreshedTokenReason,
  previousJti: string,
) {
  const accessTokenPayload = {
    id: accessTokenInput.id,
    username: accessTokenInput.username,
    role: accessTokenInput.role,
  };

  const jti = randomUUID();

  const refreshTokenPayload = {
    id: insertTokenInput.id,
    jti,
  };

  const signedAccessToken = jwt.sign(accessTokenPayload, env.ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRES_TIME,
  });

  const signedRefreshToken = jwt.sign(refreshTokenPayload, env.REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRES_TIME,
  });

  const refreshTokenInput: RefreshTokenInput = {
    ...insertTokenInput,
    jti,
  };

  await insertTokenRepository(refreshTokenInput, reason, previousJti);

  return { signedAccessToken, signedRefreshToken };
}
