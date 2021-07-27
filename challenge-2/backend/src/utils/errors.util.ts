export class AuthenticationError extends Error {}

export class AuthorizationError extends Error {}

export class InvalidRequestError extends Error {}

export class NotFoundError extends Error {}

export class ConflictError extends Error {}

export class CustomValidationError extends Error {
  private readonly _err: any;

  constructor(errors: any) {
    super();
    this._err = errors;
  }

  get err(): any {
    return this._err;
  }
}
