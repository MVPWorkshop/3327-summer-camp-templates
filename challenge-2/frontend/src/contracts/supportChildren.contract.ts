import { AbiInvalid } from '../shared/utils/error.util';
import Web3Service from '../services/web3/web3.service';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { TransactionReceipt } from 'web3-core';
import { ICampaignContractStruct } from '../shared/types/supportChildren.types';

enum EContractMethods {
  IS_CAMPAIGN_ACTIVE = 'isCampaignActive',
  GET_CAMPAIGN = 'getCampaign',
  CREATE_CAMPAIGN = 'createCampaign',
  DONATE = 'donate',
  DONATE_ETH = 'donateETH'
}

interface IReceiptDataDetails {
  eventName: string;
  returnValueOfEvent: string;
}

class SupportChildrenContract {

  public readonly address: string;
  public readonly contract: Contract;

  constructor(abi: AbiItem[], contractAddress: string) {
    if (!abi || !(abi instanceof Array)) {
      throw new AbiInvalid();
    }

    this.address = contractAddress;

    const web3 = Web3Service.web3;

    if (!web3) {
      throw new Error('Web3 wasn\'t initialized')
    }

    this.contract = new web3.eth.Contract(abi, contractAddress);
  }

  private async executeContractMethod<ReturnType>(executeType: 'call' | 'send', methodName: EContractMethods, methodParams?: any[], receiptData?: IReceiptDataDetails, value?: number): Promise<ReturnType> {
    const fromAddress = await Web3Service.getCurrentAccountAddress();

    return new Promise((resolve, reject) => {

      const method = this.contract.methods[methodName](...(methodParams || []));

      const txDetails = {
        from: fromAddress,
        gas: 250000,
        value
      };

      // We call this callback if we don't want to await the transaction mining
      const regularCallback = (error: Error, result: ReturnType) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      };

      // When we do we call this one and we need to provide receiptData for the function to know what to return
      const onReceipt = (receipt: TransactionReceipt) => {
        if (receipt.events) {
          const value = receipt.events[receiptData!.eventName].returnValues[receiptData!.returnValueOfEvent];

          resolve(value);
        }

        reject();
      };

      if (executeType === 'call') {
        // Calling is always regular since nothing gets emitted
        method.call(txDetails, regularCallback)
      } else {
        // Sending is conditional based on receipt data being provided
        if (receiptData) {
          method.send(txDetails).on('receipt', onReceipt);
        } else {
          method.send(txDetails, regularCallback);
        }
      }
    })
  }

  private async callContractMethod<ReturnType>(methodName: EContractMethods, methodParams?: any[]): Promise<ReturnType> {
    return this.executeContractMethod('call', methodName, methodParams);
  }

  private async sendContractMethod<ReturnType>(methodName: EContractMethods, methodParams?: any[], receiptData?: IReceiptDataDetails, value?: number): Promise<ReturnType> {
    return this.executeContractMethod('send', methodName, methodParams, receiptData, value);
  }

  public async isCampaignActive(id: number): Promise<boolean> {
    return this.callContractMethod<boolean>(EContractMethods.IS_CAMPAIGN_ACTIVE, [id]);
  }

  public async getCampaign(id: number): Promise<ICampaignContractStruct> {
    return this.callContractMethod<ICampaignContractStruct>(EContractMethods.GET_CAMPAIGN, [id])
  }

  public async createCampaign(beneficiary: string, endTimestamp: number, uri: string): Promise<number> {
    console.log([beneficiary, endTimestamp, uri])

    return this.sendContractMethod(
      EContractMethods.CREATE_CAMPAIGN,
      [beneficiary, endTimestamp, uri],
      {
        eventName: "CampaignCreated",
        returnValueOfEvent: "campaignId"
      }
    )
  }

  public async donate(campaignId: number, token: string, amount: number) {
    return this.sendContractMethod(
      EContractMethods.DONATE,
      [campaignId, token, amount]
    )
  }

  public async donateETH(campaignId: number, amount: number) {
    return this.sendContractMethod(
      EContractMethods.DONATE_ETH,
      [campaignId],
      undefined,
      amount
    )
  }

  public async getAllCampaigns() {
    const events = await this.contract.getPastEvents(
      'CampaignCreated',
      {
        fromBlock: 0,
        toBlock: 'latest'
      })

    return events.map(event => {
      return {
        id: event.returnValues.campaignId,
        endTimestamp: event.returnValues.campaign[0],
        beneficiary: event.returnValues.campaign[1],
        url: event.returnValues.campaign[2],
      }
    })
  }
}

export default SupportChildrenContract;
