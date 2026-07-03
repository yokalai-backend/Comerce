import { FastifyReply, FastifyRequest } from "fastify";
import { createUser } from "./auth.service";

export async function createUserController(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  rep: FastifyReply,
) {
  await createUser(req.body);
  return rep.ok("User registered successfully", null, 201);
}

export async function loginUserController(
  req: FastifyRequest<{ Body: LoginUserInput }>,
) {}
