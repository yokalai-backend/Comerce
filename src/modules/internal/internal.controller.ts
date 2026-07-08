import { FastifyReply, FastifyRequest } from "fastify";
import { hashPassword } from "../../core/utils/hash/hashing";
import {
  getUserByIdRepository,
  updateUserRepository,
} from "./internal.repository";
import { UpdateUserInput, UserUUID } from "./internal.schema";

export async function updateUserController(
  req: FastifyRequest<{ Params: UserUUID; Body: UpdateUserInput }>,
  rep: FastifyReply,
) {
  const userId = req.params.userId;
  const username = req.body?.username;
  const hashedPassword = req.body?.password
    ? await hashPassword(req.body.password)
    : undefined;

  await updateUserRepository(userId, { username, hashedPassword });

  rep.internalOk();
}

export async function getUserByIdController(
  req: FastifyRequest<{ Params: UserUUID }>,
  rep: FastifyReply,
) {
  const userId = req.params.userId;

  const res = await getUserByIdRepository(userId);

  rep.internalOk(res);
}
