import axios, { AxiosBasicCredentials } from 'axios';
import { EAuthenticationType, IAuthenticationData } from '../types/auth.types';
import { DynamicObject } from '../types/util.types';
import { AuthenticationError, AuthorizationError } from './errors.util';

function ApiClient(baseUrl: string, auth?: IAuthenticationData, additionalHeaders?: DynamicObject<string>) {
  let basicAuth: AxiosBasicCredentials | undefined;
  let headers: DynamicObject = {...additionalHeaders};

  if (auth) {
    if (auth.type === EAuthenticationType.OAUTH_TOKEN) {
      headers['Authorization'] = `token ${auth.token}`;
    }
    if (auth.type === EAuthenticationType.BASIC_AUTHENTICATION) {
      basicAuth = {
        password: auth.password,
        username: auth.username
      }
    }
  }

  const client = axios.create({
    baseURL: baseUrl,
    auth: basicAuth,
    headers
  });

  // Init the interceptors
  client.interceptors.response.use(
    function onResponse(response) {
      return response;
    },
    function onError(error) {
      if (error.response && error.response.status) {
        const errorCode = error.response.status;

        if (errorCode === 401) {
          return Promise.reject(new AuthenticationError());
        } else if (errorCode === 403) {
          return Promise.reject(new AuthorizationError());
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  return client;
}

export default ApiClient;
