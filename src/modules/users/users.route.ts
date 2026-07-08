import { FastifyInstance } from "fastify";
import { validateBody } from "../../core/utils/validation/validate.request";
import verifyTokenPlugin from "../../plugins/verify.token.plugin";
import {
  getUserProfilesByIdController,
  patchUserBirthDateController,
  updateUserProfilesDetailsController,
} from "./users.controller";
import { patchBirthDateSchema, updateUserProfilesSchema } from "./users.schema";

export function userRoute(app: FastifyInstance) {
  app.register(verifyTokenPlugin);

  app.get("/", getUserProfilesByIdController);

  app.put(
    "/",
    { preValidation: validateBody(updateUserProfilesSchema) },
    updateUserProfilesDetailsController,
  );

  app.patch(
    "/birth-date",
    { preValidation: validateBody(patchBirthDateSchema) },
    patchUserBirthDateController,
  );
}
