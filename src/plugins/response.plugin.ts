import { FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";

function plugin(app: FastifyInstance) {
  app.decorateReply(
    "ok",
    function (
      this: FastifyReply,
      message: string,
      data: unknown,
      statusCode?: number,
    ) {
      return this.code(statusCode ?? 200).send({
        success: true,
        message,
        data: data ?? null,
        code: null,
      });
    },
  );

  app.decorateReply(
    "notOk",
    function (
      this: FastifyReply,
      message: string,
      code: string,
      statusCode: number,
    ) {
      return this.code(statusCode).send({
        success: false,
        message,
        data: null,
        code,
      });
    },
  );
}

export default fp(plugin);
