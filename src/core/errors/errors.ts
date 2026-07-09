import { AppError } from "./app.error";

const errors = {
  unAuthorized: (message: string, code?: string) =>
    new AppError(message, code ?? "UNAUTHORIZED", 401),
  forbidden: (message: string, code?: string) =>
    new AppError(message, code ?? "FORBIDDEN", 403),
  badRequest: (message: string, code?: string) =>
    new AppError(message, code ?? "BAD_REQUEST", 400),
  notFound: (message: string, code?: string) =>
    new AppError(message, code ?? "NOT_FOUND", 404),
};

export default errors;
