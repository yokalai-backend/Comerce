import { FastifyInstance } from "fastify";
import { getUserByIdController } from "./users.controller";
import verifyTokenPlugin from "../../plugins/verify.token.plugin";

export function userRoute(app: FastifyInstance) {
  app.register(verifyTokenPlugin);

  app.get("/", getUserByIdController);
}
