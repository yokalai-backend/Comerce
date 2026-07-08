import { FastifyRequest, FastifyReply } from "fastify";
import { insertUserProfilesRepository } from "./internal.repository";

interface InsertUserProfilesInput {
  userId: string;
  username: string;
}

export async function insertUserProfilesController(
  req: FastifyRequest<{ Body: InsertUserProfilesInput }>,
  rep: FastifyReply,
) {
  const input = req.body;

  await insertUserProfilesRepository(input);

  return rep.internalOk();
}
