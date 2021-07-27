import { ValidatorFields } from '../../../types/util.types';
import { checkSchema } from 'express-validator';
import { val } from '../middlewares/validate.middleware';
import SubscriptionRouteDefinitions from '../definitions/subscription.route';

type PostCreateSubscriptionKeys = (keyof SubscriptionRouteDefinitions.IPostCreateSubscriptionBody);

const PostCreateSubscriptionSchema: ValidatorFields<PostCreateSubscriptionKeys> = {
  email: {
    in: ['body'],
    errorMessage: 'Email must be of correct format',
    isString: true,
    isEmail: true,
    optional: true
  }
}

export default class SubscriptionValidator {
  public static validatePostCreateSubscription = val(checkSchema(PostCreateSubscriptionSchema));
}
