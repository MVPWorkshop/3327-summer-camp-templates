import React from 'react';
import Page from '../../organisms/Page/page';
import styles from './campaign.page.module.scss';
import { useParams } from 'react-router-dom';
import { ICampaignPageParams } from './campaign.page.types';

const CampaignPage = () => {

  const { id } = useParams<ICampaignPageParams>();

  return (
    <Page className={styles.campaignPage} containerEnabled={true}>
      {id}
      {/*<p>{title ? title : `Campaign ${id}`}</p>*/}
      {/*<p>Ends at: {moment(endTimestamp).format("DD/MMMM/YYYY")}</p>*/}
      {/*<p>{description ? description : 'No description'}</p>*/}
    </Page>
  )
}

export default CampaignPage;
