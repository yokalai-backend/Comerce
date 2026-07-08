import { FastifyRequest, FastifyReply } from "fastify";
import { createUserProfilesRepository } from "./internal.repository";

export async function createUserProfilesController(
  req: FastifyRequest<{ Body: createUserProfilesInput }>,
  rep: FastifyReply,
) {
  const input = req.body;

  await createUserProfilesRepository(input);

  return rep.internalOk();
}
