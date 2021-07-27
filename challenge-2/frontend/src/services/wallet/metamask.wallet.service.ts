import { bufferToHex, hashPersonalMessage } from 'ethereumjs-util'
import Web3Service from '../web3/web3.service'
import { Web3NoProviderFound, Web3UserDeclinedSigning } from '../../shared/utils/error.util';

class MetaMaskWalletService {

  static RPCMethods = {
    PERSONAL_SIGN: 'personal_sign',
    ETH_SEND_TRANSACTION: 'eth_sendTransaction'
  };

  public static async signData(signingPayload: string, accountAddress: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await Web3Service.askForPermission();
        const msg = bufferToHex(Buffer.from(signingPayload));

        if (!Web3Service.web3 || !Web3Service.web3.currentProvider) {
          throw new Web3NoProviderFound();
        }

        // @ts-ignore
        Web3Service.web3!.currentProvider.sendAsync({
          method: MetaMaskWalletService.RPCMethods.PERSONAL_SIGN,
          params: [msg, accountAddress],
          from: accountAddress
        }, (error: Error, data: {result: string, error: Error}) => {
          if (data?.error) {
            reject(new Web3UserDeclinedSigning());
          }

          if (error) {
            reject(error);
          }

          resolve(data.result);
        });
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default MetaMaskWalletService
