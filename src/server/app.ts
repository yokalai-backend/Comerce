import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import errorHandlerPlugin from "../plugins/error.handler.plugin";
import responsePlugin from "../plugins/response.plugin";

export default function buildApp() {
  const app = fastify({ logger: true, trustProxy: true });

  app.register(fastifyCookie);
  app.register(errorHandlerPlugin);
  app.register(responsePlugin);

  return app;
}
