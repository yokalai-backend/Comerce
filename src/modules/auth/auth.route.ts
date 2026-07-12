import { FastifyInstance } from "fastify";
import verifyRefreshToken from "../../core/utils/tokens/verify.token";
import {
  createUserController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from "./auth.controller";
import { validateBody } from "../../core/utils/validation/validate.request";
import { loginUserSchema } from "./auth.schema";

export default function authRoute(app: FastifyInstance) {
  app.post(
    "/register",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "5 hour",
        },
      },
    },
    createUserController,
  );

  app.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
      preValidation: validateBody(loginUserSchema),
    },
    loginUserController,
  );

  app.post(
    "/refresh",
    {
      config: {
        rateLimit: {
          max: 50,
          timeWindow: "20 minute",
        },
      },
      preValidation: verifyRefreshToken,
    },
    refreshTokenController,
  );

  app.post(
    "/logout",

    {
      // config: {
      //   rateLimit: {
      //     max: 50,
      //     timeWindow: "20 minute",
      //   },
      // },
      preValidation: verifyRefreshToken,
    },
    logoutUserController,
  );
}
