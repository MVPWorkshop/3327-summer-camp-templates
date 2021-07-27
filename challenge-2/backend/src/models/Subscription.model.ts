import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript';
import User from './User.model';

export interface ISubscriptionAttributes {
  id: string;
  mail_subscribed: boolean;
  wallet_address: string;
}

@Table({
  freezeTableName: true,
  modelName: 'subscriptions',
  timestamps: true,
  underscored: true
})
export default class Subscription extends Model<Subscription> implements ISubscriptionAttributes {
  @PrimaryKey
  @Unique
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID})
  id: string;

  @ForeignKey(() => User)
  @Column
  wallet_address: string;

  @BelongsTo(() => User)
  user: User

  @Column
  mail_subscribed: boolean;
}
