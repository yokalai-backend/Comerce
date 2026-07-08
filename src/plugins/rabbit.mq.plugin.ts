import amqp from "amqplib";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import env from "../core/config/env";

async function plugin(f: FastifyInstance) {
  const conn = await amqp.connect(env.AMQP_URL);
  const channel = await conn.createChannel();

  await channel.assertExchange("user_events", "topic", { durable: true });

  f.decorate("rabbitmq", { conn, channel });

  f.addHook("onClose", async () => {
    await channel.close();
    await conn.close();
  });
}

export default fp(plugin);
