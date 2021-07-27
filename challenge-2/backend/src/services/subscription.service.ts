import Subscription from '../models/Subscription.model';
import User from '../models/User.model';

class SubscriptionService {
  public static async list(): Promise<Subscription[]> {
    return Subscription.findAll();
  }

  public static async getSubscriptionById(id: string): Promise<Subscription> {
    return Subscription.findOne({
      where: {
        id
      },
      include: [
        { model: User }
      ]
    })
  }

  public static async getAllMailSubscriptions(): Promise<Subscription[]> {
    return Subscription.findAll({
      where: {
        mail_subscribed: true
      },
      include: [
        { model: User }
      ]
    })
  }

  public static async updateMailSubscription(walletAddress: string, mailSubscribed: boolean): Promise<Subscription> {
    let subscription = await Subscription.findOne({
      where: {
        wallet_address: walletAddress
      }
    })

    if (subscription) {
      subscription.update({
        mail_subscribed: mailSubscribed
      })
    } else {
      subscription = await Subscription.create({
        wallet_address: walletAddress,
        mail_subscribed: mailSubscribed
      })
    }

    return subscription;
  }
}

export default SubscriptionService;
