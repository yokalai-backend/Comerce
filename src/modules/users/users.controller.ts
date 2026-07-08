import { FastifyRequest, FastifyReply } from "fastify";
import { getUserByIdRepository } from "./users.repository";

export async function getUserByIdController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const userId = req.user.id;

  const res = await getUserByIdRepository(userId);

  rep.ok("User data received", res);
}
