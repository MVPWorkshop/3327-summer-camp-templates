import { ICampaign } from '../../shared/types/supportChildren.types';
import { ECampaignReduxActions, SetAllCampaignsAction, SetCampaignAction } from './campaign.redux.types';
import { Thunk } from '../redux.types';
import ActionUtil from '../../shared/utils/action.util';
import NftStorageService from '../../services/nftStorage/nftStorage.service';
import SupportChildrenContract from '../../contracts/supportChildren.contract';
import SupportChildrenAbi from '../../abi/supportChildren.abi.json';
import { SUPPORT_CHILDREN_CONTRACT_ADDRESS } from '../../shared/constants/config.constants';
import { AbiItem } from 'web3-utils';
import moment from 'moment';

export function setCampaign(campaign: ICampaign): SetCampaignAction {
  return {
    type: ECampaignReduxActions.SET_CAMPAIGN,
    payload: {
      id: campaign.id,
      campaign
    }
  }
}

export function setAllCampaigns(campaigns: ICampaign[]): SetAllCampaignsAction {
  return {
    type: ECampaignReduxActions.SET_ALL_CAMPAIGNS,
    payload: {
      campaigns
    }
  }
}

export function createCampaign(title: string, description: string, img: File, beneficiary: string, endTimestamp: number): Thunk<Promise<void>> {
  return async dispatch => {
    try {
      dispatch(ActionUtil.requestAction(ECampaignReduxActions.CREATE_CAMPAIGN));

      const { metadata: ipfsMetadata, img: ipfsImg } = await NftStorageService.storeNft(title, description, img);
      const metadataLink = NftStorageService.parseNftLink(ipfsMetadata);
      const imgLink = NftStorageService.parseNftLink(ipfsImg);

      const supportChildren = new SupportChildrenContract(SupportChildrenAbi as AbiItem[], SUPPORT_CHILDREN_CONTRACT_ADDRESS);
      const unixTime = moment(endTimestamp).unix();
      const id = await supportChildren.createCampaign(beneficiary, unixTime, metadataLink);

      dispatch(setCampaign({
        imageUri: imgLink,
        id,
        title,
        description,
        endTimestamp,
        beneficiary
      }))

      dispatch(ActionUtil.successAction(ECampaignReduxActions.CREATE_CAMPAIGN));
    } catch (error) {
      dispatch(ActionUtil.errorAction(ECampaignReduxActions.CREATE_CAMPAIGN));
    }
  }
}

export function fetchAllCampaigns(): Thunk<Promise<void>> {
  return async dispatch => {
    try {
      dispatch(ActionUtil.requestAction(ECampaignReduxActions.FETCH_ALL_CAMPAIGNS));

      const supportChildren = new SupportChildrenContract(SupportChildrenAbi as AbiItem[], SUPPORT_CHILDREN_CONTRACT_ADDRESS);

      const campaignStructs = await supportChildren.getAllCampaigns();

      const campaigns: ICampaign[] = [];
      for (let i = 0; i < campaignStructs.length; i++) {
        const { id, beneficiary, endTimestamp, url } = campaignStructs[i];

        let image, description, name;

        try {
          const response = await fetch(url);
          const body = await response.json();

          image = body.image;
          description = body.description;
          name = body.name;
        } catch (error) {
        }

        campaigns.push({
          id,
          beneficiary,
          endTimestamp: moment.unix(endTimestamp).valueOf(),
          imageUri: image ? NftStorageService.parseNftLink(image) : undefined,
          description,
          title: name
        })
      }

      dispatch(setAllCampaigns(campaigns));
      dispatch(ActionUtil.successAction(ECampaignReduxActions.FETCH_ALL_CAMPAIGNS));
    } catch (error) {
      dispatch(ActionUtil.errorAction(ECampaignReduxActions.FETCH_ALL_CAMPAIGNS));
    }
  }
}
