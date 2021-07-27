import { NextFunction, Request, Response } from 'express';
import { APIResponse } from '../../../utils/response.util';

class StatusRoute {
  public static async getStatus(request: Request, response: Response, next: NextFunction) {
    try {
      return response.json(APIResponse.success({
        message: 'Server is alive.',
      }));
    } catch (error) {
      return next(error);
    }
  }
}

export default StatusRoute;
