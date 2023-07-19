import React, {useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import  ActivityList  from './ActivityList';
import { useStore } from '../../../app/stores/store';
import Loading from '../../../app/layout/Loading';



const ActivityDashboard = () => {

  const {activityStore} = useStore();
  const {activityRegistry, loadActivities} = activityStore;

  useEffect(() => {
    if(activityRegistry.size <= 1) loadActivities();
  }, [activityStore])


  if (activityStore.loadingInitial) return <Loading content='Loading app...' />

  return (
    <Grid>
        <Grid.Column width='10'>
            <ActivityList />
        </Grid.Column>
        <Grid.Column width='6'>
          <h3>Filters</h3>
        </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard);
