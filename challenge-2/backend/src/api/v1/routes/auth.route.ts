import '../../../config/passport.config';
import AuthRouteDefinitions, { EAuthRoute } from '../definitions/auth.route';
import AuthService from '../../../services/auth.service';
import { deserializeWeb3Payload } from '../../../utils/auth.util';
import User from '../../../models/User.model';
import passport from 'passport';
import { AuthorizationError } from '../../../utils/errors.util';
import { IUserEntity, mapUserEntity } from '../../../entities/user.entity';
import { APIResponse } from '../../../utils/response.util';

class AuthRoute {
  public static register: AuthRouteDefinitions.RouteMethod<EAuthRoute.PostRegister> = async (request, response, next) => {
    try {
      const {
        payload,
        signature,
        email
      } = request.body;

      const user = await AuthService.register(deserializeWeb3Payload(payload), signature, email);

      request.logIn(mapUserEntity(user), (err) => {
        if (err) {
          next(err);
        }

        return response.status(200).end();
      })
    } catch (error) {
      next(error);
    }
  }

  public static login: AuthRouteDefinitions.RouteMethod<EAuthRoute.PostLogin> = async (request, response, next) => {
    try {
      passport.authenticate('local', (err: Error, user: User) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          throw new AuthorizationError();
        }

        request.logIn(user, (err) => {
          if (err) {
            next(err);
          }

          return response.status(200).end();
        })
      })(request, response, next);
    } catch (error) {
      next(error);
    }
  }

  public static logout: AuthRouteDefinitions.RouteMethod<EAuthRoute.PostLogout> = async (request, response, next) => {
    try {
      request.logout();

      return response.status(200).end();
    } catch (error) {
      next(error)
    }
  }

  public static me: AuthRouteDefinitions.RouteMethod<EAuthRoute.GetMe> = async (request, response, next) => {
    try {
      const user = request.user as IUserEntity;

      return response.status(200).json(APIResponse.success(user));

    } catch (error) {
      next(error);
    }
  }
}

export default AuthRoute;
