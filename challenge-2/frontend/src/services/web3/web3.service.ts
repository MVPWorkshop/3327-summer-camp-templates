import Web3 from 'web3';
import {
  NonEthereumBrowserError,
  Web3AccessRejected,
  Web3NotInitialised,
  Web3NoAccountFound
} from '../../shared/utils/error.util';
import { ENetworkTypes } from '../../shared/types/web3.types';

class Web3Service {
  private readonly _web3: Web3 | undefined;
  constructor() {
    if (window.ethereum) { // New browsers inject 'ethereum' object
      this._web3 = new Web3(window.ethereum);
    } else if (window.web3) { // Legacy dapp browsers inject 'web3' object
      this._web3 = new Web3(window.web3)
    }
  }
  public get web3() {
    this.checkEthereumSupport();
    return this._web3;
  }
  private checkEthereumSupport() {
    if (!Web3Service.isEthereumBrowser()) {
      throw new NonEthereumBrowserError();
    }
  }
  private checkIfInitialised() {
    if (!this._web3) {
      throw new Web3NotInitialised()
    }
  }
  public static isEthereumBrowser(): boolean {
    if (window.web3 || window.ethereum) {
      return true;
    } else {
      return false;
    }
  }
  public async askForPermission() {
    this.checkIfInitialised();
    this.checkEthereumSupport();
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.enable()
      } catch (error) {
        throw new Web3AccessRejected();
      }
    }
  }
  public async getCurrentNetwork(): Promise<ENetworkTypes> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.askForPermission();
        const network = await this._web3!.eth.net.getNetworkType() as ENetworkTypes;
        resolve(network);
      } catch (error) {
        reject(error);
      }
    })
  }
  public async getCurrentAccountAddress(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.askForPermission();
        await this._web3!.eth.getAccounts((error, accounts) => {
          if (error != null) {
            reject(error)
          } else if (accounts.length === 0) {
            reject(new Web3NoAccountFound())
          } else {
            resolve(accounts[0])
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

const web3Service = new Web3Service();
export default web3Service;
