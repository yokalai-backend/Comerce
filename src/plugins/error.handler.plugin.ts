import fp from "fastify-plugin";
import { FastifyInstance } from "fastify/types/instance";
import { ZodError } from "zod";
import { AppError } from "../core/errors/app.error";

function plugin(app: FastifyInstance) {
  app.setErrorHandler(async (error, req, rep) => {
    if (error instanceof ZodError) {
      const errorMessage = error.issues[0].message;

      rep.notOK(errorMessage, "INPUT_ERROR", 400);
      req.log.warn(error);

      return;
    } // INPUT ERROR

    if (error instanceof AppError) {
      rep.notOK(error.message, error.code, error.statusCode);

      req.log.warn(error);
      return;
    } // CONDITIONAL ERROR

    req.log.error(error);
    rep.notOK("Something went wrong", "INTERNAL_ERROR", 500); // UNKNOWN ERROR
  });
}

export default fp(plugin);
