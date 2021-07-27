import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { EmptyObject, ParamsDictionary } from '../../../types/util.types';
import { IUserEntity } from '../../../entities/user.entity';
import { IResponseSuccess } from '../../../utils/response.util';

export enum EAuthRoute {
  GetMe = 'GetMe',
  PostRegister = 'PostRegister',
  PostLogin = 'PostLogin',
  PostLogout = 'PostLogout'
}

declare namespace AuthRouteDefinitions {

  type ResponseBody<T extends EAuthRoute> =
  // GET /me
    T extends EAuthRoute.GetMe ? IUserEntity :
      EmptyObject;

  type RequestBody<T extends EAuthRoute> =
    T extends EAuthRoute.PostRegister ? IPostAuthBody :
    T extends EAuthRoute.PostLogin ? IPostAuthBody :
      EmptyObject;

  type RequestQueries<T extends EAuthRoute> =
    EmptyObject;

  type RequestParams<T extends EAuthRoute> =
    EmptyObject;

  type Response<T extends EAuthRoute> = ExpressResponse<IResponseSuccess<ResponseBody<T>>>

  type Request<T extends EAuthRoute> = ExpressRequest<RequestParams<T> & ParamsDictionary, IResponseSuccess<ResponseBody<T>>, RequestBody<T>, RequestQueries<T>>

  type RouteMethod<T extends EAuthRoute> = (request: Request<T>, response: Response<T>, next: NextFunction) => Promise<any>;

  // Request Bodies
  interface IPostAuthBody {
    payload: string;
    signature: string;
    email?: string;
  }
}

export default AuthRouteDefinitions;
