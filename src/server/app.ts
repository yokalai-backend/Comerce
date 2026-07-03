import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";

export default function buildApp() {
  const app = fastify({ logger: true, trustProxy: true });

  app.register(fastifyCookie);

  return app;
}
