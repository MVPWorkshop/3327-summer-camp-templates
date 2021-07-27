import User from '../models/User.model';
import { Transaction } from 'sequelize';

class UserService {
  public static async list(): Promise<User[]> {
    return User.findAll();
  }

  public static async getUserByWalletAddress(walletAddress: string): Promise<User> {
    return User.findOne({
      where: {
        wallet_address: walletAddress
      }
    });
  }

  public static async createUser(data: { address: string, email?: string }): Promise<[User, boolean]> {
    return User.findOrCreate({
      where: {
        wallet_address: data.address
      },
      defaults: {
        wallet_address: data.address,
        email: data.email
      }
    });
  }

  public static async updateUserEmail(walletAddress: string, email: string): Promise<void> {
    const user = await this.getUserByWalletAddress(walletAddress);

    await user.update({ email });
  }
}

export default UserService;
