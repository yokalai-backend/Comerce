import { z } from "zod";

export const userIdSchema = z.object({
  userId: z.uuid(),
});

export type UserUUID = z.infer<typeof userIdSchema>;

export const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username too short")
    .max(50, "Username too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores",
    )
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character")
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
