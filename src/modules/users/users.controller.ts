import { FastifyReply, FastifyRequest } from "fastify";
import { getUserProfilesByIdRepository } from "./users.repository";
import { patchUserBirthDate, updateUserProfilesDetails } from "./users.service";

export async function getUserProfilesByIdController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const userId = req.user.id;
  const res = await getUserProfilesByIdRepository(userId);

  return rep.ok("Received user profiles", res);
}

export async function updateUserProfilesDetailsController(
  req: FastifyRequest<{ Body: UpdateUserProfilesDetailsInput }>,
  rep: FastifyReply,
) {
  const userId = req.user.id;
  const input = req.body;

  await updateUserProfilesDetails(userId, input);

  rep.ok("User profiles updated");
}

export async function patchUserBirthDateController(
  req: FastifyRequest<{ Body: { birthDate: Date } }>,
  rep: FastifyReply,
) {
  const userId = req.user.id;
  const birthDate = req.body.birthDate;

  await patchUserBirthDate(userId, birthDate);

  rep.ok(`Birth date updated`);
}
