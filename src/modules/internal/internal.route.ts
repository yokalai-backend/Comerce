import { FastifyInstance } from "fastify";
import validateInternalKeyPlugin from "../../plugins/validate.internal.key.plugin";
import { createUserProfilesController } from "./internal.controller";

export default function internalRoute(app: FastifyInstance) {
  app.register(validateInternalKeyPlugin);

  app.get("/health", async (req, rep) => {
    rep.internalOk("Responded");
  });

  app.post("/user", createUserProfilesController);
}
