import User from '../models/User.model';
import { IDeserializedPayload, getSignatureParams, verifySignature } from '../utils/auth.util';
import { ConflictError } from '../utils/errors.util';
import UserService from './user.service';

class AuthService {
  public static async login(payload: IDeserializedPayload, signature: string): Promise<User> {
    const { address } = getSignatureParams(payload.string, signature);
    verifySignature(payload.parsed);

    const dbUser = await UserService.getUserByWalletAddress(address);

    return dbUser;
  }

  public static async register(payload: IDeserializedPayload, signature: string, email?: string): Promise<User> {
    const { address } = getSignatureParams(payload.string, signature);
    verifySignature(payload.parsed);

    const [dbUser, created] = await UserService.createUser({ address, email })

    if (!created) {
      throw new ConflictError();
    }

    return dbUser;
  }
}

export default AuthService;
