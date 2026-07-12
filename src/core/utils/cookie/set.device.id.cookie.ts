import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { ONE_MONTH_IN_SECONDS } from "../../../constant";
import { cookieOptions } from "../../config/cookie";
import errors from "../../errors/errors";

export default function setDeviceIdCookie(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const rawDeviceId = req.cookies.deviceId;

  if (rawDeviceId) {
    const unsigned = req.unsignCookie(rawDeviceId);

    if (!unsigned.valid) {
      throw errors.unAuthorized("Invalid device");
    }

    return unsigned.value!;
  }

  const deviceId = randomUUID();

  rep.setCookie("deviceId", deviceId, {
    ...cookieOptions.dev,
    maxAge: ONE_MONTH_IN_SECONDS,
    signed: true,
  });

  return deviceId;
}
