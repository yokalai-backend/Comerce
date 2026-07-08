import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import internalRoute from "../modules/internal/internal.route";
import { userRoute } from "../modules/users/users.route";
import rabbitMqPlugin from "../plugins/rabbit.mq.plugin";
import responsePlugin from "../plugins/response.plugin";
import userCreatedConsumer from "../broker/user.created.consumer";

export default function buildApp() {
  const app = fastify({ logger: true, trustProxy: true });

  app.register(fastifyCookie);
  app.register(responsePlugin);
  app.register(rabbitMqPlugin);
  app.register(userCreatedConsumer);

  // ROUTES
  app.register(userRoute);
  app.register(internalRoute, { prefix: "/internal" });

  return app;
}
