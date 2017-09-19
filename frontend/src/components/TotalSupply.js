import React from 'react';
import {Header, Icon, Item, Segment, Statistic} from 'semantic-ui-react';
import {web3} from '../config';

export default ({name, value}) => {

  //Checks for undefined values due to render before initializing
  if(typeof(value) === 'undefined') value = 0;

  return (
    <Segment inverted>
      <Header as='h2'>
      <Icon name='plug' />
        <Header.Content>
         {name}
        </Header.Content>
      </Header>
      <Item >
        <Statistic.Group items={[{label:'SWC', value:web3.utils.fromWei(value, 'ether')}]} inverted color='green'/>
      </Item>
    </Segment>
  )
}
