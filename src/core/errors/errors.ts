import { AppError } from "./app.error";

const errors = {
  unAuthorized: (message: string, code?: string) =>
    new AppError(message, code ?? "UN_AUTHORIZED", 401),
  forbidden: (message: string, code?: string) =>
    new AppError(message, code ?? "FORBIDDEN", 403),
};

export default errors;
