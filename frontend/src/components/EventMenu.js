import React, {Component} from 'react';
import { Divider, Feed, Header, Icon, Input, Menu, Segment,} from 'semantic-ui-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import EventListing from './EventListing';
import Pagination from './Pagination';

export default class EventMenu extends Component {
  constructor() {
    super();
      this.state = {
          filteredItems: [],
          pageOfItems: []
      };

      this.handleItemClick = this.handleItemClick.bind(this);
      this.onChangePage = this.onChangePage.bind(this);
  }
  onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

  handleItemClick(e, { name }) {
    this.props.setEventFilter(name)
    if(typeof(this.props.coinState.pastEvents) !== "undefined") {
      let items = this.props.coinState.pastEvents.filter(e=>{
         if(name==='All') {
           return e
         } else {
           return e.event===name}
         })
      this.setState({filteredItems:items});
    }
  console.log("bangeroo filtered")

  }

  render() {
      const activeItem  = this.props.eventFilter || 'All';
      return (
        <div className="Events">
          <Segment inverted>
            <Divider inverted />
            <Divider inverted horizontal >
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
              <Menu.Item name='TransferFrom' active={activeItem === 'TransferFrom'} onClick={this.handleItemClick} />
              <Menu.Item name='SwitchEvent' active={activeItem === 'SwitchEvent'} onClick={this.handleItemClick} />
              <Menu.Item name='TokensAdded' active={activeItem === 'TokensAdded'} onClick={this.handleItemClick} />
              <Menu.Item name='RateChange' active={activeItem === 'RateChange'} onClick={this.handleItemClick} />
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input icon='search' placeholder='Search...' />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Segment>
          <Segment inverted>
            <Pagination
               className="paginator"
               items={ activeItem === 'All' ? this.props.coinState.pastEvents : this.state.filteredItems}
               onChangePage={this.onChangePage}
            />
            <Feed style={{ margin: '2em 0'}}>
              {typeof(this.props.coinState.pastEvents) !== "undefined" &&
                (
                    <ReactCSSTransitionGroup
                        transitionName="event"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={0}>
                        {  this.state.pageOfItems.map(EventListing) }
                      </ReactCSSTransitionGroup>
                )
              }
            </Feed>
          </Segment>

        </div>
      )
    }
}
