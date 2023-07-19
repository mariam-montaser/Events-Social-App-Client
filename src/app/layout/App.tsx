import React, { useEffect} from 'react';
import './styles.css';
import { Container } from 'semantic-ui-react';

import { observer } from 'mobx-react-lite';


import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import { useStore } from '../stores/store';

function App() {

  const {activityStore} = useStore();

  const {loadActivities, loadingInitial} = activityStore;

  useEffect(() => {
    loadActivities();
  }, [activityStore])


  if(loadingInitial ) return <Loading content='Loading App...'  />

  return (
    <>
      <Navbar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
