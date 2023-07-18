import React, { useEffect, useState } from 'react';
import './styles.css';
import { Container } from 'semantic-ui-react';
import { v4 as uuid} from 'uuid';

import { Navbar } from './Navbar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { Activity } from '../models/activity';
import axios from 'axios';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity]= useState<Activity | undefined>(undefined);
  const [editMode, setEditMode]= useState(false);
  useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then(({data}) => {
      console.log(data);
      
      setActivities(data);
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
    setActivities([...activities.filter(activity => activity.id !== id)]);
  }

  const handleCreateOrEditActivity = (activity: Activity) => {
    activity.id
    ? setActivities([...activities.filter(activ => activ.id !== activity.id), activity])
    : setActivities([...activities, {...activity, id: uuid()}])
    setEditMode(false);
    setSelectedActivity(activity);
  }


  return (
    <>
      <Navbar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          editMode={editMode}
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
