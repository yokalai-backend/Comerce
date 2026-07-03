import { AppError } from "./app.error";

const errors = {
  notFound: async (message: string, code?: string) =>
    new AppError(message, code ?? "NOT_FOUND", 404),
  authorized: async (message: string, code?: string) =>
    new AppError(message, code ?? "AUTHORIZED", 401),
  badRequest: async (message: string, code?: string) =>
    new AppError(message, code ?? "BAD_REQUEST", 400),
  conflict: async (message: string, code?: string) =>
    new AppError(message, code ?? "CONFLICT", 409),
};

export default errors;
