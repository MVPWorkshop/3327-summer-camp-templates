// Used for typing some dynamic object, first param defines the value type, second the key type
import { QueryInterface } from 'sequelize';
import { ParamSchema } from 'express-validator';

export type DynamicObject<
  Value = any,
  Key extends (string | number) = string,
  AllKeysRequired = false
  > = AllKeysRequired extends true ?
  {[K in Key]: Value} :
  {[K in Key]?: Value};

export type AllKeysRequired = true;

export type EmptyObject = {};

export type ParamsDictionary = {[key: string]: string};

export type SequelizeMigration = () => {
  up: (queryInterface: QueryInterface, Sequelize: any) => Promise<void>;
  down: (queryInterface: QueryInterface, Sequelize: any) => Promise<void>
}

export type ValidatorFields<T extends string> = DynamicObject<ParamSchema, T, AllKeysRequired>;
