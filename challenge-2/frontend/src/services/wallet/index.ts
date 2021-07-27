import { EWalletTypes } from '../../shared/types/web3.types';
import Web3Service from '../web3/web3.service';
import MetaMaskWalletService from './metamask.wallet.service';

class WalletService {
  private readonly _walletType: EWalletTypes;

  constructor() {
    // Currently hardcoded in the future this can programmatically changed on instantiation
    // and call functions accordingly with adapter like pattern
    this._walletType = EWalletTypes.METAMASK;
  }

  public async sign(data: string): Promise<string | undefined> {
    const currentAddress = await Web3Service.getCurrentAccountAddress();
    let signature: string | undefined;

    if (this._walletType === EWalletTypes.METAMASK) {
      signature = await MetaMaskWalletService.signData(data, currentAddress);
    }

    console.log(signature);

    return signature;
  }
}

export default WalletService;
