import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import authRoute from "../modules/auth/auth.route";
import cronJobsPlugin from "../plugins/cron.jobs.plugin";
import errorHandlerPlugin from "../plugins/error.handler.plugin";
import rateLimitHandlerPlugin from "../plugins/rate.limit.handler.plugin";
import responsePlugin from "../plugins/response.plugin";

export default function buildApp() {
  const app = fastify({ logger: true, trustProxy: true });

  // PLUGINS
  app.register(fastifyCookie);
  app.register(responsePlugin);
  app.register(errorHandlerPlugin);
  app.register(rateLimitHandlerPlugin);

  // CRON
  app.register(cronJobsPlugin);

  // ROUTES
  app.register(authRoute);

  return app;
}
