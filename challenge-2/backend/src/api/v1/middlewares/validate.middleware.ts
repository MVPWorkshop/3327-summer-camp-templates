import { ValidationChain, validationResult } from 'express-validator';
import { NextFunction, RequestHandler } from 'express';
import { CustomValidationError } from '../../../utils/errors.util';

async function validateRequest(request?: Request, response?: Response, next?: NextFunction) {
  const result = validationResult(request);
  const errors = result.mapped();

  if (!result.isEmpty()) {
    return next(new CustomValidationError(errors));
  } else {
    return next();
  }
}

export function val(validationChain: ValidationChain[]): RequestHandler[] {
  // @ts-ignore
  return [...validationChain, validateRequest];
}
