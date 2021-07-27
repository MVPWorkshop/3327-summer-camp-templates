import { combineReducers } from 'redux';
import LoadingReducer from './loading/loading.redux.reducer';
import CampaignReducer from './campaign/campaign.redux.reducer';

const rootReducer = combineReducers({
  loading: LoadingReducer,
  campaigns: CampaignReducer
});

export default rootReducer;
