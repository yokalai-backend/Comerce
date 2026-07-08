import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ZodError } from "zod";
import { AppError } from "../core/errors/app.error";
import { InternalError } from "../core/errors/internal.error";

function plugin(f: FastifyInstance) {
  f.setErrorHandler(async (error, req, rep) => {
    if (error instanceof ZodError) {
      const errorMessage = error.issues[0].message;

      rep.notOk(errorMessage, "INPUT_ERROR", 400);
      req.log.warn(error.issues.slice(0, 3), "Input zod validation error");

      return;
    }

    if (error instanceof AppError) {
      rep.notOk(error.message, error.code, error.statusCode);

      req.log.warn(error);
      return;
    }

    if (error instanceof InternalError) {
      req.log.error(error, "Internal services error");
    } else {
      req.log.error(error, "Unexpected error");
    }
    rep.notOk("Something went wrong", "INTERNAL_ERROR", 500);
  });
}

export default fp(plugin);
