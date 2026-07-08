import { FastifyInstance } from "fastify";
import { validateParams } from "../../core/utils/validation/validate.request";
import validateInternalKey from "../../plugins/validate.internal.key";
import {
  getUserByIdController,
  updateUserController,
} from "./internal.controller";
import { userIdSchema } from "./internal.schema";

export default function internalRoute(app: FastifyInstance) {
  app.register(validateInternalKey);

  app.put(
    "/:userId",

    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minute",
        },
      },
      preValidation: validateParams(userIdSchema),
    },
    updateUserController,
  );

  app.get(
    "/:userId",
    { preValidation: validateParams(userIdSchema) },
    getUserByIdController,
  );

  app.get("/health", async (req, rep) => {
    rep.ok("Responded");
  });
}
