export class AppError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
