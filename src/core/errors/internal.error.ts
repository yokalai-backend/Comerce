export class InternalError extends Error {
  code: string;
  from: string;
  statusCode: number;

  constructor(message: string, code: string, from: string, statusCode: number) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.from = from;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
