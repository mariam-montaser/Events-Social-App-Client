import React from 'react'
import { Grid } from 'semantic-ui-react'
import { ActivityList } from './ActivityList'
import { ActivityDetails } from '../details/ActivityDetails'
import { ActivityForm } from '../form/ActivityForm'
import { Activity } from '../../../app/models/activity'

interface Props{
  activities: Activity[];
  selectedActivity: Activity|undefined;
  editMode: boolean;
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  openForm: (id: string) => void;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

export const ActivityDashboard = ({activities, selectedActivity, editMode, selectActivity, cancelSelectActivity, openForm, closeForm, createOrEdit, deleteActivity}: Props) => {
  return (
    <Grid>
        <Grid.Column width='10'>
            <ActivityList 
              activities={activities}
              selectActivity={selectActivity}
              deleteActivity={deleteActivity}
            />
        </Grid.Column>
        <Grid.Column width='6'>
          {selectedActivity && !editMode && 
            <ActivityDetails 
            activity={selectedActivity}
            openForm={openForm}
            cancelSelect={cancelSelectActivity}
            />}
          {editMode &&
            <ActivityForm
              activity={selectedActivity}
              closeForm={closeForm}
              createOrEdit={createOrEdit}
            />}
        </Grid.Column>
    </Grid>
  )
}
