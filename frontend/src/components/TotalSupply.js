import React from 'react';
import {Header, Icon, Item, Segment, Statistic} from 'semantic-ui-react';

export default ({totalSupply}) => {
  return (
    <Segment inverted>
      <Header as='h2'>
      <Icon name='plug' />
        <Header.Content>
        Token Supply
        </Header.Content>
      </Header>
      <Item >
        <Statistic.Group items={[{label:'SWC', value:totalSupply}]} inverted color='green'/>
      </Item>
    </Segment>
  )
}
