import React, {Component} from 'react';
import {Divider, Header, Icon, Input, Menu, Segment,} from 'semantic-ui-react';

export default class EventMenu extends Component {
  constructor() {
    super();
    this.handleItemClick = this.handleItemClick.bind(this);
  }
  handleItemClick(e, { name }) {
    this.props.setEventFilter(name)
  }
  render() {
      const activeItem  = this.props.eventFilter;
      return (
        <Segment inverted>
          <Divider inverted />
          <Divider horizontal inverted>
          <Header as='h2' inverted>
            <Icon name='browser' />
              <Header.Content>
              Events
              </Header.Content>
            </Header>
          </Divider>
          <Menu pointing inverted>
            <Menu.Item name='All' active={activeItem === 'All'} onClick={this.handleItemClick} />
            <Menu.Item name='Transfer' active={activeItem === 'Transfer'} onClick={this.handleItemClick} />
            <Menu.Item name='Approval' active={activeItem === 'Approval'} onClick={this.handleItemClick} />
            <Menu.Item name='Toggled' active={activeItem === 'Toggled'} onClick={this.handleItemClick} />
            <Menu.Item name='Tokens Added' active={activeItem === 'Tokens Added'} onClick={this.handleItemClick} />
            <Menu.Item name='Rate Change' active={activeItem === 'Rate Change'} onClick={this.handleItemClick} />
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' placeholder='Search...' />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
      )
    }
}
