import { FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";

function plugin(f: FastifyInstance) {
  f.decorateReply(
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

  f.decorateReply(
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

  f.decorateReply("internalOk", function (this: FastifyReply, data: unknown) {
    return this.code(200).send({ data: data ?? "SUCCESS" });
  });

  f.decorateReply(
    "internalNotOk",
    function (
      this: FastifyReply,
      message: string,
      code: string,
      statusCode: number,
    ) {
      return this.code(statusCode).send({ message, code, statusCode });
    },
  );
}

export default fp(plugin);
