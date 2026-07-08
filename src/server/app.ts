import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import authRoute from "../modules/auth/auth.route";
import internalRoute from "../modules/internal/internal.route";
import cronJobsPlugin from "../plugins/cron.jobs.plugin";
import errorHandlerPlugin from "../plugins/error.handler.plugin";
import rabbitMqPlugin from "../plugins/rabbit.mq.plugin";
import rateLimitHandlerPlugin from "../plugins/rate.limit.handler.plugin";
import responsePlugin from "../plugins/response.plugin";

export default function buildApp() {
  const app = fastify({ logger: true, trustProxy: true });

  // PLUGINS
  app.register(fastifyCookie);
  app.register(rateLimitHandlerPlugin);
  app.register(responsePlugin);
  app.register(errorHandlerPlugin);
  app.register(rabbitMqPlugin);

  // CRON
  app.register(cronJobsPlugin);

  // ROUTES
  app.register(authRoute);
  app.register(internalRoute, { prefix: "/internal" });

  return app;
}
