import { CookieSerializeOptions } from "@fastify/cookie";

export const cookieOptions = {
  dev: {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
  } satisfies CookieSerializeOptions,
  prod: {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: true,
  } satisfies CookieSerializeOptions,
};
