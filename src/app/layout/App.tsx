import React from 'react';
import './styles.css';
import { Container } from 'semantic-ui-react';

import { observer } from 'mobx-react-lite';


import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { Route } from 'react-router-dom';
import Homepage from '../../features/home/Homepage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityForm from '../../features/activities/form/ActivityForm';

function App() {

  return (
    <>
      <Route exact path='/' component={Homepage} />
      <Route path={'/(.+)'} render={() => (
        <>
          <Navbar />
          <Container style={{ marginTop: '7em' }}>
            <Route exact path='/activities' component={ActivityDashboard} />
            <Route path='/activities/:id' component={ActivityDetails} />
            <Route path={['/createActivity', '/manage/:id']} component={ActivityForm} />
            {/* <ActivityDashboard /> */}
          </Container>
        </>
      )}
      />
    </>
  );
}

export default observer(App);
