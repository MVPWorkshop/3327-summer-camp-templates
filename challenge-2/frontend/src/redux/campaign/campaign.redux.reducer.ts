import { Reducer } from 'redux';
import { CampaignReduxAction, CampaignReduxReducerState, ECampaignReduxActions } from './campaign.redux.types';

const initialState: CampaignReduxReducerState = {};

const campaignReduxReducer: Reducer<CampaignReduxReducerState, CampaignReduxAction> = (state = initialState, action) => {
  switch (action.type) {
    case ECampaignReduxActions.SET_CAMPAIGN: {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload.campaign
        }
      }
    }
    case ECampaignReduxActions.SET_ALL_CAMPAIGNS: {
      const newState = {...state};

      action.payload.campaigns.map(campaign => (
        newState[campaign.id] = campaign
      ))

      return newState;
    }
    default: {
      return state;
    }
  }
}

export default campaignReduxReducer;
