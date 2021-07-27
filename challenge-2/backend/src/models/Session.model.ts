import { Column, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

export interface ISessionAttributes {
  sid: string;
  expires: Date;
  data: string;
}

@Table({
  modelName: 'session',
  timestamps: true,
  underscored: true,
  freezeTableName: true
})
export default class Session extends Model<Session> implements ISessionAttributes {
  @PrimaryKey
  @Unique
  @Column
  sid: string;

  @Column
  expires: Date;

  @Column
  data: string;
}
