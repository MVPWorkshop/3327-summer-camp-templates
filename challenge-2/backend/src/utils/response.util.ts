import { DynamicObject } from '../types/util.types';

export interface IResponseSuccess<T extends DynamicObject | Array<any>> {
  result: T;
}

interface IResponseError {
  error: {
    code: number,
    message: string;
  };
  details?: any;
}

export class APIResponse {
  public static success<T extends DynamicObject | Array<any>>(data: T): IResponseSuccess<T> {

    const response: IResponseSuccess<T> = {
      result: data
    };

    return response;
  }

  public static error(code: number, message: string, errors?: any): IResponseError {
    const response: IResponseError = {
      error: {
        code,
        message
      },
      details: errors
    };

    return response;
  }
}
