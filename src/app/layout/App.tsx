import React, { useEffect, useState } from 'react';
import './styles.css';
import { Container } from 'semantic-ui-react';
import { v4 as uuid} from 'uuid';

import { Navbar } from './Navbar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { Activity } from '../models/activity';
import axios from 'axios';
import agent from '../api/agent';
import { Loading } from './Loading';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity]= useState<Activity | undefined>(undefined);
  const [editMode, setEditMode]= useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity)
      });
      setActivities(activities);
      setLoading(false);
    })
  }, [])

  const handleSelectActivity = (id: string) =>{
    setSelectedActivity(activities.find(activity => activity.id === id))
  }

  const handleCancelSelect = () => {
    setSelectedActivity(undefined);
  }

  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelSelect();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }

  const handleDeleteActivity = (id: string) => {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(activity => activity.id !== id)]);
      setSubmitting(false);
    })
  }

  const handleCreateOrEditActivity = (activity: Activity) => {
    setSubmitting(true);
    if(activity.id){
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(activ => activ.id !== activity.id), activity])
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, {...activity, id: uuid()}]);
      })
    }
    setEditMode(false);
    setSelectedActivity(activity);
    setSubmitting(false);
  }

  if(loading ) return <Loading content='Loading App...'  />

  return (
    <>
      <Navbar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          editMode={editMode}
          submitting={submitting}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelect}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
