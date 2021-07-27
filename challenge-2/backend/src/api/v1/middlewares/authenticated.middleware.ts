import { AuthenticationError } from '../../../utils/errors.util';
import { NextFunction, Request, Response } from 'express';

export function isAuthenticated(request: Request, response: Response, next: NextFunction) {
  if (request.isAuthenticated()) {
    return next();
  }

  return next(new AuthenticationError('Not authenticated'));
}
