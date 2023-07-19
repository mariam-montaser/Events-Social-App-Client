import React, {useEffect} from 'react'
import { Button, Card, Grid, Image } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import Loading from '../../../app/layout/Loading';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsChat from './ActivityDetailsChat';
import ActivityDetailsSidebar from './ActivityDetailsSidebar';



const ActivityDetails = () => {

  const {activityStore} = useStore();
  const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore;
  const {id} = useParams<{id: string}>();


  useEffect(() => {
    if (id) loadActivity(id);
    
  }, [id, loadActivity])

  if (loadingInitial || !activity) return <Loading content='Loading Activity...'/>;

  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat />
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityDetailsSidebar />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails);
