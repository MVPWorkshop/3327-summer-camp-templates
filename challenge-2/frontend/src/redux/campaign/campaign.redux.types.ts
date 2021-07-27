import { ReduxAction } from '../redux.types';
import { ICampaign } from '../../shared/types/supportChildren.types';
import { DynamicObject } from '../../shared/types/util.types';

export enum ECampaignReduxActions {
  SET_CAMPAIGN = 'SET_CAMPAIGN',
  SET_ALL_CAMPAIGNS = 'SET_ALL_CAMPAIGNS',
  CREATE_CAMPAIGN = 'CREATE_CAMPAIGN',
  FETCH_ALL_CAMPAIGNS = 'FETCH_ALL_CAMPAIGNS',
  FETCH_CAMPAIGN = 'FETCH_CAMPAIGN'
}

export type SetCampaignAction = ReduxAction<ECampaignReduxActions.SET_CAMPAIGN, {
  id: number;
  campaign: ICampaign;
}>

export type SetAllCampaignsAction = ReduxAction<ECampaignReduxActions.SET_ALL_CAMPAIGNS, {
  campaigns: ICampaign[];
}>

export type CampaignReduxAction =
  SetCampaignAction |
  SetAllCampaignsAction;

export type CampaignReduxReducerState = DynamicObject<ICampaign, number>;
