import session from 'express-session';
import { CONFIG } from './index';
import Database from '../models';
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { COOKIE_SECRET, SESSION_TABLE, COOKIE_DOMAIN, COOKIE_HTTP_ONLY, COOKIE_SECURE, COOKIE_NAME } = CONFIG;
const sessionStore = new SequelizeStore({db: Database, table: SESSION_TABLE});

export const SESSION_OPTIONS = {
  secret: COOKIE_SECRET,
  resave: false,
  name: COOKIE_NAME,
  saveUninitialized: true,
  cookie: {
    httpOnly: COOKIE_HTTP_ONLY === 'true',
    domain: COOKIE_DOMAIN as string,
    secure: COOKIE_SECURE === 'true'
  },
  store: sessionStore
};
