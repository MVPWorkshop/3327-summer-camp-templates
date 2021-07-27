import '../../../config/passport.config';
import { IUserEntity } from '../../../entities/user.entity';
import SubscriptionRouteDefinitions, { ESubscriptionRoute } from '../definitions/subscription.route';
import UserService from '../../../services/user.service';
import SubscriptionService from '../../../services/subscription.service';

class SubscriptionRoute {
  public static createSubscription: SubscriptionRouteDefinitions.RouteMethod<ESubscriptionRoute.PostCreateSubscription> = async (request, response, next) => {
    try {
      let userWalletAddress = (request.user as IUserEntity).walletAddress;

      if (request.body.email) {
        await UserService.updateUserEmail(userWalletAddress, request.body.email)
      }

      const user = await UserService.getUserByWalletAddress(userWalletAddress);
      if (!user.email) {
        throw new Error("Can't subscribe user without an email");
      }

      await SubscriptionService.updateMailSubscription(userWalletAddress, true);

      return response.status(200).end();
    } catch (error) {
      next(error);
    }
  }

  public static cancelSubscription: SubscriptionRouteDefinitions.RouteMethod<ESubscriptionRoute.PutCancelSubscription> = async (request, response, next) => {
    try {
      let userWalletAddress = (request.user as IUserEntity).walletAddress;

      await SubscriptionService.updateMailSubscription(userWalletAddress, false);

      return response.status(200).end();
    } catch (error) {
      next(error);
    }
  }
}

export default SubscriptionRoute;
