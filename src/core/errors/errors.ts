import { AppError } from "./app.error";

const errors = {
  notFound: (message: string, code?: string) =>
    new AppError(message, code ?? "NOT_FOUND", 404),
  unAuthorized: (message: string, code?: string) =>
    new AppError(message, code ?? "UNAUTHORIZED", 401),
  badRequest: (message: string, code?: string) =>
    new AppError(message, code ?? "BAD_REQUEST", 400),
  conflict: (message: string, code?: string) =>
    new AppError(message, code ?? "CONFLICT", 409),
  tooMany: (message: string, code?: string) =>
    new AppError(message, code ?? "TOO_MANY_REQUESTS", 429),
};

export default errors;
