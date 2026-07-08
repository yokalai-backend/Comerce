import { FastifyInstance } from "fastify";
import { insertUserProfilesController } from "./internal.controller";
import validateInternalKeyPlugin from "../../plugins/validate.internal.key.plugin";

export default function internalRoute(app: FastifyInstance) {
  app.register(validateInternalKeyPlugin);

  app.get("/health", async (req, rep) => {
    rep.internalOk("Responded");
  });

  app.post("/user", insertUserProfilesController);
}
