import React from 'react'
import { Profile } from '../../app/models/profile'
import { Card, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

interface Props{
    profile: Profile
}

const ProfileCard = ({profile}: Props) => {
  return (
    <Card as={Link} to={`/profile/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>
                    Bio goes here
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                20 Followers
            </Card.Content>
        </Card>
  )
}

export default ProfileCard