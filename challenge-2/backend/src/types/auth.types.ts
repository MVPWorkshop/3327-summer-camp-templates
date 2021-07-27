import { AxiosRequestConfig } from 'axios';

export enum EAuthenticationType {
  OAUTH_TOKEN= 'OAUTH_TOKEN',
  BASIC_AUTHENTICATION = 'BASIC_AUTHENTICATION'
}

interface IAuthentication {
  type: EAuthenticationType;
}

export interface IOauthAuthentication extends IAuthentication {
  type: EAuthenticationType.OAUTH_TOKEN;
  token: string;
}

export interface IBasicAuthentication extends IAuthentication {
  type: EAuthenticationType.BASIC_AUTHENTICATION;
  username: string;
  password: string;
}

export interface ApiRequestParams {
  url: string;
  config?: AxiosRequestConfig;
  data?: any;
}

export interface IWeb3LoginPayload {
  timestamp: number;
}

export type IAuthenticationData =
  IOauthAuthentication |
  IBasicAuthentication;
