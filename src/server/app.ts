import fastify from "fastify";
import productsRoute from "../modules/products/products.route";
import fastifyCookie from "@fastify/cookie";

export default function buildApp() {
  const app = fastify({ logger: true, trustProxy: true });

  app.register(fastifyCookie);

  // ACCESS ROUTES
  app.register(productsRoute);

  return app;
}
