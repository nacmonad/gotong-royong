import React from 'react';
import {Feed, Icon} from 'semantic-ui-react';

export default ({user, time, likeCount}, i)=>{
  return (
    <Feed.Event key={i}>
      <Feed.Label>
        <Icon name="alarm outline"/>
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User>{user}</Feed.User> added you as a friend
          <Feed.Date>{time}</Feed.Date>
        </Feed.Summary>
        <Feed.Meta>
          <Feed.Like>
            <Icon name='like' />
            {likeCount} Likes
          </Feed.Like>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  )
}
