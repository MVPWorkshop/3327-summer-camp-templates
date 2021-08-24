import React, { useEffect } from 'react';
import Page from '../../organisms/Page/page';
import styles from './home.page.module.scss';
import Separator from '../../atoms/Separator/separator';
import CampaignCard from '../../molecules/Campaign/campaignCard';
import { ICampaign } from '../../../shared/types/supportChildren.types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCampaigns } from '../../../redux/campaign/campaign.redux.actions';
import { RootState } from '../../../redux/redux.types';
import { createLoadingSelector } from '../../../redux/loading/loading.redux.reducer';
import { ECampaignReduxActions } from '../../../redux/campaign/campaign.redux.types';

const HomePage = () => {

  const campaigns: ICampaign[] = useSelector<RootState, ICampaign[]>(state => {
    const keys = Object.keys(state.campaigns)
    if (keys.length) {
      return keys.map(id => state.campaigns[id as unknown as number] as ICampaign);
    } else {
      return [];
    }
  });
  const dispatch = useDispatch();

  const isFetchingCampaigns = useSelector<RootState, boolean>(
    state => createLoadingSelector([
      ECampaignReduxActions.FETCH_ALL_CAMPAIGNS
    ])(state)
  )

  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  return (
    <Page className={styles.homePage} containerEnabled={true}>
      <Separator/>
      <p className="fs-32 ff-poppins color-accent-secondary mt-4">
        Support children
      </p>
      <Separator/>

      {isFetchingCampaigns ? "Loading..." : undefined}

      <div className="flex-grow-1 flex-wrap d-flex align-items-center justify-content-center">
        { campaigns.map(campaign =>
          <CampaignCard key={campaign.id} {...campaign} className="m-4"/>)
        }
      </div>
    </Page>
  )
}

export default HomePage;
