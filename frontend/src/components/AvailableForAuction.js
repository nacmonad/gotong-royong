import React from 'react';
import {Header, Icon, Segment, Statistic} from 'semantic-ui-react';

export default ({availableForAuction}) => {
  return (
    <Segment inverted>
      <Header as='h2'>
      <Icon name='plug' />
        <Header.Content>
        Available For Auction
        </Header.Content>
      </Header>
      <Statistic.Group items={[{label:'SWC', value:availableForAuction}]} inverted color='green'/>
    </Segment>
  )
}
