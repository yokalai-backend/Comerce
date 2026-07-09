import { z } from "zod";
import { getNames } from "country-list";

export const updateUserProfilesSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Fullname too short")
    .max(200, "Fullname too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores",
    )
    .optional(),
  avatarUrl: z.url().optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
    .optional(),
});

export const patchBirthDateSchema = z.object({
  birthDate: z.coerce.date(),
});

const countries = new Set(getNames());

export const addUserAddressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(3, "Label too short")
    .max(50, "Label too long")
    .regex(
      /^[\p{L}\p{N}\s-]+$/u,
      "Label may only contain letters, numbers, spaces, and hyphens",
    ),

  streetAddress: z
    .string()
    .trim()
    .min(3, "Street address too short")
    .max(500, "Street address too long")
    .regex(/^[\p{L}\p{N}\s.,/#'-]+$/u, "Invalid street address format"),

  city: z
    .string()
    .trim()
    .min(2, "City name too short")
    .max(100, "City name too long")
    .regex(/^[\p{L}\s.'-]+$/u, "Invalid city name format"),

  country: z
    .string()
    .trim()
    .refine((country) => countries.has(country), "Country not found"),

  asDefault: z.boolean().default(false),
});
