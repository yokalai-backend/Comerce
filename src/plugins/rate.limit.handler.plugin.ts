import fastifyRateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import redis from "../core/config/redis";

function plugin(app: FastifyInstance) {
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
    redis,
    nameSpace: "rate-limit",
    errorResponseBuilder: async (req, ctx) => {
      app.log.warn(
        { ...ctx, ip: req.ip, url: req.url, method: req.method },
        `Rate limit exceeded`,
      );

      return {
        success: false,
        message: "Too Many Requests",
        data: null,
        code: "TOO_MANY_REQUESTS",
      };
    },
  });
}

export default fp(plugin);
