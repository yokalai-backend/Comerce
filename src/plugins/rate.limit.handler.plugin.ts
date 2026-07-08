import fastifyRateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import redis from "../core/config/redis";
import errors from "../core/errors/errors";

function plugin(f: FastifyInstance) {
  f.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
    redis,
    nameSpace: "rate-limit",
    errorResponseBuilder: (req, ctx) => {
      f.log.warn(
        { ...ctx, ip: req.ip, url: req.url, method: req.method },
        `Rate limit exceeded`,
      );

      return errors.tooMany("Too many requests");
    },
  });
}

export default fp(plugin);
