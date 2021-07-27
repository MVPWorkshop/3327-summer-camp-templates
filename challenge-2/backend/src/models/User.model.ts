import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript';

@Table({
  freezeTableName: true,
  modelName: 'users',
  timestamps: true,
  underscored: true
})
export default class User extends Model<User> {
  @Unique
  @PrimaryKey
  @Column
  wallet_address: string;

  @AllowNull(true)
  @Column
  email: string;
}
