import { FastifyReply, FastifyRequest } from "fastify";
import setDeviceIdCookie from "../../core/utils/cookie/set.device.id.cookie";
import setTokensCookie from "../../core/utils/cookie/set.tokens.cookie";
import { getTokenRepository, revokeTokenRepository } from "./auth.repository";
import { createUser, loginUser, logout, refreshToken } from "./auth.service";
import errors from "../../core/errors/errors";

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
  const previousJti = req.refreshToken?.jti;
  const deviceInput = {
    ipAddr: req.ip,
    deviceAgent: req.headers["user-agent"] ?? "no agents",
  };

  const deviceId = setDeviceIdCookie(req, rep);

  const tokens = await loginUser(req.body, deviceInput, deviceId, previousJti);

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
  const ipAddress = req.ip;
  const rawDevieId = req.cookies.deviceId;

  if (!rawDevieId) {
    throw errors.unAuthorized("Device id not provided");
  }
  const cookieResult = req.unsignCookie(rawDevieId);
  if (!cookieResult.valid) throw errors.unAuthorized("Invalid device");

  const verifiedRefreshToken = req.refreshToken;

  const refreshTokenInput: RefreshTokenInput = {
    id: verifiedRefreshToken.id,
    jti: verifiedRefreshToken.jti,
    deviceId: cookieResult.value,
    ipAddress,
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
  const ipAddress = req.ip;
  const rawDevieId = req.cookies.deviceId;

  if (!rawDevieId) {
    throw errors.unAuthorized("Device id not provided");
  }
  const cookieResult = req.unsignCookie(rawDevieId);
  if (!cookieResult.valid) throw errors.unAuthorized("Invalid device");

  const verifiedRefreshToken = req.refreshToken;

  const refreshTokenInput: RefreshTokenInput = {
    id: verifiedRefreshToken.id,
    jti: verifiedRefreshToken.jti,
    deviceId: cookieResult.value,
    ipAddress,
  };

  await logout(verifiedRefreshToken.jti, refreshTokenInput);

  return rep.ok("Logout successfull");
}
