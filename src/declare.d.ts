import fastify from "fastify";

declare module "fastify" {
  interface FastifyReply {
    ok(message: string, data?: unknown, statusCode?: number): FastifyReply;
    notOk(message: string, code: string, statusCode: number): FastifyReply;
  }
  interface FastifyRequest {
    refreshToken: {
      id: string;
      jti: string;
    };
  }
}
