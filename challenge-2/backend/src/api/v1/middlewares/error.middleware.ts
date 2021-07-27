import { NextFunction, Request, Response } from 'express';
import {
  ConflictError,
  NotFoundError,
  InvalidRequestError,
  AuthorizationError,
  AuthenticationError, CustomValidationError
} from '../../../utils/errors.util';
import { APIResponse } from '../../../utils/response.util';

export async function error(error: Error, request: Request, response: Response, next: NextFunction) {
console.log(error)
  let status: number;
  let message: string;
  let errors: any | undefined;

  if (error instanceof ConflictError) {
    status = 409;
    message = error.message || 'Conflict'
  } else if (error instanceof NotFoundError) {
    status = 404;
    message = error.message || 'Not found'
  } else if (error instanceof InvalidRequestError) {
    status = 400;
    message = error.message || 'Invalid request'
  } else if (error instanceof AuthorizationError) {
    status = 403;
    message = error.message || 'Authorization error';
  } else if (error instanceof AuthenticationError) {
    status = 401;
    message = error.message || 'Not authenticated';
  } else if (error instanceof CustomValidationError) {
    status = 422;
    message = error.message || 'Validation error';
    errors = error.err;
  } else {
    status = 500;
    message = 'Server error';
  }

  return response.status(status).json(APIResponse.error(status, message, errors));
}
