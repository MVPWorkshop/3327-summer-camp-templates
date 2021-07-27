import {Sequelize} from 'sequelize-typescript';
import {CONFIG} from '../config'

const db =  new Sequelize({
  database: CONFIG.DB_NAME,
  dialect: CONFIG.DB_DIALECT as any,
  username: CONFIG.DB_USER,
  password: CONFIG.DB_PASSWORD,
  models: [__dirname + '/*.model.*'],
  logging: (query) => console.log(query)
});

export default db;
