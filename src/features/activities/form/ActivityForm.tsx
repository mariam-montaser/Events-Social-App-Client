import React, {useState, ChangeEvent, useEffect} from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import {v4 as uuid} from 'uuid'
// import { useParams, useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../../app/layout/Loading';


const ActivityForm = () => {

  const {id} = useParams<{id: string}>();
  // const navigate = useNavigate()
  const {activityStore} = useStore();
  const { loadActivity, createActivity, updateActivity, loading, loadingInitial} = activityStore;
  const [activity, setActivity] = useState({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!));
  }, [id, loadActivity])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
    const {name, value} = event.target;
    setActivity({...activity, [name]: value})
  }

  const handleSubmit = ()=>{
    if(id) {
      updateActivity(activity)
      //updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    } else {
      activity.id = uuid()
      createActivity(activity);
      //createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  }

  if (loadingInitial) return <Loading content='Loading activity...' />

  return (
    <Segment clearing>
        <Form onSubmit={handleSubmit} autoComplete='off'>
            <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange} />
            <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange} />
            <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange} />
            <Form.Input type='date' placeholder='Date' name='date' value={activity.date} onChange={handleInputChange} />
            <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange} />
            <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange} />

            <Button loading={loading} floated='right' positive type='submit' content='Save' />
            <Button as={Link} to='/activities'  floated='right' positive type='button' content='Cancel' />
        </Form>
    </Segment>
  )
}

export default observer(ActivityForm);
