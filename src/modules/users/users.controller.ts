import { FastifyReply, FastifyRequest } from "fastify";
import {
  getUserProfilesById,
  patchUserBirthDate,
  updateUserProfilesDetails,
} from "./users.service";

export async function getUserProfilesByIdController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const userId = req.user.id;
  const res = await getUserProfilesById(userId);

  return rep.ok("Received user profiles", res);
}

export async function updateUserProfilesDetailsController(
  req: FastifyRequest<{ Body: UpdateUserProfilesDetailsInput }>,
  rep: FastifyReply,
) {
  const userId = req.user.id;
  const input = req.body;

  const res = await updateUserProfilesDetails(userId, input);

  rep.ok("User profiles updated", res);
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
