import { FastifyReply } from "fastify";
import { cookieOptions } from "../../config/cookie";
import {
  FIFTEEN_MINUTES_IN_SECONDS,
  ONE_WEEK_IN_SECONDS,
} from "../../../constant";

export default async function setTokensCookie(
  rep: FastifyReply,
  tokens: Tokens,
) {
  rep.setCookie("accessToken", tokens.accessToken, {
    ...cookieOptions.dev,
    maxAge: FIFTEEN_MINUTES_IN_SECONDS,
  });

  rep.setCookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions.dev,
    maxAge: ONE_WEEK_IN_SECONDS,
  });
}
