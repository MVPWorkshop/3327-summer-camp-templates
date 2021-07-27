import {CONFIG} from '../config';

const {DB_DIALECT, DB_NAME, DB_PASSWORD, DB_HOST, DB_USER, DB_PORT, NODE_ENV} = CONFIG;

const config: any = {};

config[NODE_ENV] = {
  dialect: DB_DIALECT,
  database: DB_NAME,
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_seed'
};

module.exports = config;
