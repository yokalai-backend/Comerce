import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { insertUserProfilesRepository } from "../modules/internal/internal.repository";

async function plugin(f: FastifyInstance) {
  const { channel } = f.rabbitmq;

  await channel.assertQueue("users_service.user_created", { durable: true });
  await channel.bindQueue(
    "users_service.user_created",
    "user_events",
    "user.created",
  );
  await channel.prefetch(10);

  channel.consume(
    "users_service.user_created",
    async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(
          msg.content.toString(),
        ) as InsertUserProfilesInput;

        await insertUserProfilesRepository({
          userId: data.userId,
          username: data.username,
          email: data.email,
        });

        channel.ack(msg);
      } catch (error) {
        f.log.error(error, "Failed processing user.created");
        channel.nack(msg, false, false);
      }
    },
    { noAck: false },
  );
}

export default fp(plugin);
