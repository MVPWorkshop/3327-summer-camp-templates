import User from '../models/User.model';

export interface IUserEntity {
  walletAddress: string;
  email?: string;
}

export function mapUserEntity(user: User): IUserEntity {
  return {
    walletAddress: user.wallet_address,
    email: user.email
  }
}

export function mapUserEntities(users: User[]): IUserEntity[] {
  return users.map(user => mapUserEntity(user));
}
