import React, { Component } from 'react';
import {bindActionCreators, } from 'redux';
import { connect } from 'react-redux';
import { Dimmer, Feed, Grid, Header, Loader, Segment } from 'semantic-ui-react'

import TotalSupply from './TotalSupply';
import AvailableForAuction from './AvailableForAuction'
import Event from './Event';
import EventMenu from './EventMenu';
import DigitalClock from './DigitalClock';
import { QRCode } from 'react-qr-svg';
import { setEventFilter, setEvents, addEvent } from '../modules/actions';

const styles = {
  height: '100vh',
  backgroundColor:'black'
}

const events = [{
      user:"Joe Schmoe",
      time:"1 hour ago",
      likeCount:4
    },
    {
      user:"Foo Bar",
      time:"2 days ago",
      likeCount:2
    },
    {
      user:"Mike Hunt",
      time:"4 days ago",
      likeCount:13
    },]

class Main extends Component {
  constructor() {
    super()
    this.state = {
      synchronized: false,
    }
  }
  // async _fetchEvents() {
  //   return await this.props.contract.events.getPastEvents('allEvents', {
  //     fromBlock: 0,
  //     toBlock: 'latest'
  //   }).then(console.log);
  // }
  componentDidMount() {
    try {
      //setup listener for all events
      var events = this.props.contract.events.allEvents({}, function(error, log){
        if (!error) console.log(log);
      });
    } catch (e) {
      //error setting up listener
      console.log(e)
    }

  events.subscribe(console.log)
  }

  render() {
    return (
      <div className="Main" style={styles}>
      <Segment inverted>
        <Grid inverted stackable columns={3}>
          <Grid.Column>
              <Header style={{display:'block'}} as='h2' inverted>
                    Switch Coin
              </Header>
              <Header style={{display:'block'}} as='h4' inverted>
                    Block #: {this.props.coinState.blockNo}
              </Header>
          </Grid.Column>
          <Grid.Column style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
              <DigitalClock/>
          </Grid.Column>
          <Grid.Column >
              {typeof(this.props.coinState.address) !== 'undefined' &&
                <div style={{display:'flex', flexDirection:'column'}}>
                  <QRCode
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="Q"
                      value={this.props.coinState.address}
                      style={{width:128, height:128}}  />
                      <div>{this.props.coinState.address}</div>
                  </div>}
          </Grid.Column>
        </Grid>
      </Segment>
        <Grid inverted stackable columns={2}>
          <Grid.Column>
              <TotalSupply totalSupply={this.props.coinState.totalSupply}/>
          </Grid.Column>
          <Grid.Column>
              <AvailableForAuction availableForAuction={this.props.coinState.availableForAuction}/>
          </Grid.Column>
        </Grid>
          <EventMenu eventFilter={this.props.eventFilter} setEventFilter={this.props.setEventFilter}/>
          <Segment inverted>
            <Dimmer active={typeof(this.props.coinState.address) !== 'undefined' && !this.state.synchronized}>
                <Loader className="EventLoader"
                  >Subscribing to events...</Loader>
            </Dimmer>
            <Feed>
              {events.map(Event)}
            </Feed>
          </Segment>
        <Dimmer
           active={typeof(this.props.coinState.address) === 'undefined'}
           page
         >
         <Header as='h2' icon inverted>
           <Loader className="Loader">Retrieving Smart Contract Info...</Loader>
         </Header>
       </Dimmer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      eventFilter:state.eventFilter,
      coinState:state.coinState,
      events:state.events
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      setEventFilter,
      setEvents,
      addEvent
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
