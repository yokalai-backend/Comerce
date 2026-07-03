import { FastifyRequest } from "fastify";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import env from "../../config/env";
import errors from "../../errors/errors";

export default function verifyRefreshToken(req: FastifyRequest) {
  const token = req.cookies.refreshToken;

  if (!token) throw errors.unAuthorized("Token not provided");

  try {
    const decoded = jwt.verify(token, env.REFRESH_TOKEN) as RefreshTokenPayload;

    req.refreshToken = decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw errors.unAuthorized("Token expired", "TOKEN_EXPIRED");

    if (error instanceof JsonWebTokenError)
      throw errors.unAuthorized("Token invalid", "TOKEN_INVALID");

    throw error;
  }
}
