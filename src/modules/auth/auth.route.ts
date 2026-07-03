import { FastifyInstance } from "fastify";
import {
  createUserController,
  loginUserController,
  refreshTokenController,
} from "./auth.controller";
import verifyRefreshToken from "../../core/utils/tokens/verify.token";

export default function authRoute(app: FastifyInstance) {
  app.post("/register", createUserController);

  app.post("/login", loginUserController);

  app.post(
    "/refresh",
    { preValidation: verifyRefreshToken },
    refreshTokenController,
  );
}
