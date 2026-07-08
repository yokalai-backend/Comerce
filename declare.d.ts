import { Channel, ChannelModel } from "amqplib";
import fastify from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    rabbitmq: { conn: ChannelModel; channel: Channel };
  }

  interface FastifyReply {
    ok(
      message: string,
      data?: unknown | null,
      statusCode?: number,
    ): FastifyReply;

    notOk(message: string, code: string, statusCode: number): FastifyReply;

    internalOk(data?: unknown): FastifyReply;

    internalNotOk(
      message: string,
      code: string,
      statusCode: number,
    ): FastifyReply;
  }

  interface FastifyRequest {
    user: {
      id: string;
      username: string;
      role: string;
    };
  }
}
