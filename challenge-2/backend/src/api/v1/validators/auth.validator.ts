import AuthRouteDefinitions from '../definitions/auth.route';
import { ValidatorFields } from '../../../types/util.types';
import { checkSchema } from 'express-validator';
import { val } from '../middlewares/validate.middleware';

type PostAuthKeys = (keyof AuthRouteDefinitions.IPostAuthBody);

const PostAuthSchema: ValidatorFields<PostAuthKeys> = {
  payload: {
    in: ['body'],
    errorMessage: 'Payload must be base64 string',
    isString: true,
    exists: true
  },
  signature: {
    in: ['body'],
    errorMessage: 'Signature must be string',
    isString: true,
    exists: true
  },
  email: {
    in: ['body'],
    errorMessage: 'Email must be of correct format',
    isString: true,
    isEmail: true,
    optional: true
  }
}

export default class AuthValidator {
  public static validatePostLogin = val(checkSchema(PostAuthSchema));
  public static validatePostRegister = val(checkSchema(PostAuthSchema));
}
