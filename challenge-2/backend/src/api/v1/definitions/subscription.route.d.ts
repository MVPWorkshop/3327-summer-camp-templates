import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { EmptyObject, ParamsDictionary } from '../../../types/util.types';
import { IResponseSuccess } from '../../../utils/response.util';

export enum ESubscriptionRoute {
  PostCreateSubscription = "PostCreateSubscription",
  PutCancelSubscription = "PutCancelSubscription"
}

declare namespace SubscriptionRouteDefinitions {

  type ResponseBody<T extends ESubscriptionRoute> =
    EmptyObject;

  type RequestBody<T extends ESubscriptionRoute> =
    T extends ESubscriptionRoute.PostCreateSubscription ? IPostCreateSubscriptionBody:
    EmptyObject;

  type RequestQueries<T extends ESubscriptionRoute> =
    EmptyObject;

  type RequestParams<T extends ESubscriptionRoute> =
    EmptyObject;

  type Response<T extends ESubscriptionRoute> = ExpressResponse<IResponseSuccess<ResponseBody<T>>>

  type Request<T extends ESubscriptionRoute> = ExpressRequest<RequestParams<T> & ParamsDictionary, IResponseSuccess<ResponseBody<T>>, RequestBody<T>, RequestQueries<T>>

  type RouteMethod<T extends ESubscriptionRoute> = (request: Request<T>, response: Response<T>, next: NextFunction) => Promise<any>;

  interface IPostCreateSubscriptionBody {
    email?: string;
  }
}

export default SubscriptionRouteDefinitions;
