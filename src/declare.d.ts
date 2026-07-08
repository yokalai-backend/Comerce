import fastify from "fastify";
import { Channel, ChannelModel } from "amqplib";

declare module "fastify" {
  interface FastifyInstance {
    rabbitmq: {
      conn: ChannelModel;
      channel: Channel;
    };
  }

  interface FastifyReply {
    ok(message: string, data?: unknown, statusCode?: number): FastifyReply;
    notOk(message: string, code: string, statusCode: number): FastifyReply;
    internalOk(data?: unknown): FastifyReply;
    internalNotOk(
      message: string,
      code: string,
      statusCode: number,
    ): FastifyReply;
  }
  interface FastifyRequest {
    refreshToken: {
      id: string;
      jti: string;
    };
  }
}
