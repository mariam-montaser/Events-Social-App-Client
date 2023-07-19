import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'
import { NavLink } from 'react-router-dom';


const Navbar = () => {

  const {activityStore} = useStore();

  return (
    <Menu inverted fixed='top'>
        <Container>
            <Menu.Item exact as={NavLink} to='/' header>
                <img src='/assets/logo.png' alt='logo' style={{marginRight: 10}} />
                Reactivities
            </Menu.Item>
            <Menu.Item as={NavLink} to='/activities' name='Activities' />

            <Menu.Item>
                <Button as={NavLink} to='/createActivity' onClick={() => activityStore.openForm()} positive content='Create Activity' />
            </Menu.Item>
        </Container>
    </Menu>
  )
}

export default Navbar;
