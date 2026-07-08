import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import env from "../core/config/env";
import errors from "../core/errors/errors";

function plugin(f: FastifyInstance) {
  f.addHook("preValidation", async (req) => {
    const token = req.cookies.accessToken;

    if (!token) throw errors.unAuthorized("No token provided");

    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN) as AccessTokenDTO;

      req.user = decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw errors.unAuthorized("Token expired", "TOKEN_EXPIRED");

      if (error instanceof JsonWebTokenError)
        throw errors.unAuthorized("Token invalid", "TOKEN_INVALID");

      throw error;
    }
  });
}

export default fp(plugin);
