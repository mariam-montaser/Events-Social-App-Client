import React from 'react'
import { Profile } from '../../app/models/profile'
import { observer } from 'mobx-react-lite'
import { Tab } from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos'
import ProfileFollowings from './ProfileFollowings'

interface Props {
  profile: Profile
}


const ProfileContent = ({profile}: Props) => {
  const panes = [
    { menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane> },
    { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />  },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    {
        menuItem: 'Followers',
        render: () => <ProfileFollowings />
    },
    {
        menuItem: 'Following',
        render: () => <ProfileFollowings />
    }
];

return (
    <Tab
        menu={{ fluid: true, vertical: true }}
        menuPosition='right'
        panes={panes}
    />
)
}

export default observer(ProfileContent);