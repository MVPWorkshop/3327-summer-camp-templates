import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from '../components/pages/Home/home.page';
import CampaignPage from '../components/pages/Campaign/campaign.page';
import CreateCampaignPage from '../components/pages/CreateCampaign/createCampaign.page';

const AppRouter = () => (
  <Switch>
    <Route path='/' exact={true} component={HomePage} />
    <Route path='/campaign/:id/details' exact={true} component={CampaignPage} />
    <Route path='/campaign/create' exact={true} component={CreateCampaignPage} />

    <Redirect to={'/not-found'}/>
  </Switch>
);

export default AppRouter
