import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import errorHandlerPlugin from "../plugins/error.handler.plugin";
import responsePlugin from "../plugins/response.plugin";
import authRoute from "../modules/auth/auth.route";

export default function buildApp() {
  const app = fastify({ logger: true, trustProxy: true });

  // PLUGINS
  app.register(fastifyCookie);
  app.register(responsePlugin);
  app.register(errorHandlerPlugin);

  // ROUTES
  app.register(authRoute);

  return app;
}
