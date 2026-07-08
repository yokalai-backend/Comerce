import { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import env from "../core/config/env";
import errors from "../core/errors/errors";

function plugin(f: FastifyInstance) {
  f.addHook(
    "onRequest",
    async (req: FastifyRequest<{ Headers: { "X-Internal-Key": string } }>) => {
      const internalKey = req.headers["x-internal-key"];

      if (!internalKey || internalKey !== env.INTERNAL_KEY)
        throw errors.unAuthorized("Access restrict");
    },
  );
}

export default fp(plugin);
