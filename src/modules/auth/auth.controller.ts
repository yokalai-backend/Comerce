import { FastifyReply, FastifyRequest } from "fastify";
import setDeviceIdCookie from "../../core/utils/cookie/set.device.id.cookie";
import setTokensCookie from "../../core/utils/cookie/set.tokens.cookie";
import { createUser, loginUser, refreshToken } from "./auth.service";
import { revokeTokenRepository } from "./auth.repository";

export async function createUserController(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  rep: FastifyReply,
) {
  await createUser(req.body, req.server);
  return rep.ok("User registered successfully", null, 201);
}

export async function loginUserController(
  req: FastifyRequest<{ Body: LoginUserInput }>,
  rep: FastifyReply,
) {
  const deviceInput = {
    ipAddr: req.ip,
    deviceAgent: req.headers["user-agent"] ?? "no agents",
  };

  const deviceId = setDeviceIdCookie(req, rep);

  const tokens = await loginUser(req.body, deviceInput, deviceId);

  setTokensCookie(rep, {
    accessToken: tokens.signedAccessToken,
    refreshToken: tokens.signedRefreshToken,
  });

  return rep.ok("Login successfull");
}

export async function refreshTokenController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const deviceId = setDeviceIdCookie(req, rep);
  const verifiedRefreshToken = req.refreshToken;

  const refreshTokenInput = {
    deviceId,
    id: verifiedRefreshToken.id,
    jti: verifiedRefreshToken.jti,
  };

  const tokens = await refreshToken(refreshTokenInput);

  setTokensCookie(rep, {
    accessToken: tokens.signedAccessToken,
    refreshToken: tokens.signedRefreshToken,
  });

  return rep.ok("Token refreshed");
}

export async function logoutUserController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const deviceId = req.cookies.deviceId;
  const verifiedRefreshToken = req.refreshToken;

  await revokeTokenRepository(verifiedRefreshToken.id, deviceId!, "logout");

  return rep.ok("Logout successfull");
}
