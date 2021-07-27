import * as dotenv from 'dotenv';
import { CorsOptions } from 'cors';

dotenv.config();

export enum ApplicationEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  TEST = 'test',
}

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
};

const {
  NODE_PORT,
  NODE_HOST,
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  NODE_ENV,
  SIGNATURE_EXPIRATION_SEC,
  COOKIE_SECRET,
  COOKIE_DOMAIN,
  COOKIE_HTTP_ONLY,
  COOKIE_SECURE,
  COOKIE_NAME,
  SESSION_TABLE,
} = process.env;

const ENV: ApplicationEnv = NODE_ENV as ApplicationEnv || ApplicationEnv.DEVELOPMENT;

export const CONFIG = {
  NODE_PORT,
  NODE_HOST,
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  CORS_OPTIONS: corsOptions,
  NODE_ENV: ENV,
  SIGNATURE_EXPIRATION_SEC,
  COOKIE_SECRET,
  COOKIE_DOMAIN,
  COOKIE_HTTP_ONLY,
  COOKIE_SECURE,
  COOKIE_NAME,
  SESSION_TABLE,
};
