import fastify from "fastify";

declare module "fastify" {
  interface FastifyReply {
    ok(message: string, data?: unknown, statusCode?: number): FastifyReply;
    notOK(message: string, code: string, statusCode: number): FastifyReply;
  }
}
