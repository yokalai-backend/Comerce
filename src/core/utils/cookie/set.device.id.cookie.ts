import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { ONE_MONTH_IN_SECONDS } from "../../../constant";
import { cookieOptions } from "../../config/cookie";

export default function setDeviceIdCookie(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  let deviceId = req.cookies.deviceId;

  if (!deviceId) {
    deviceId = randomUUID();

    rep.setCookie("deviceId", deviceId, {
      ...cookieOptions.dev,
      maxAge: ONE_MONTH_IN_SECONDS,
    });
  }

  return deviceId;
}
