import React, { Component } from 'react';
import {bindActionCreators, } from 'redux';
import { connect } from 'react-redux';
import { Dimmer, Grid, Header, Loader, Segment } from 'semantic-ui-react'

import TotalSupply from './TotalSupply';

import EventMenu from './EventMenu';
import DigitalClock from './DigitalClock';
import { QRCode } from 'react-qr-svg';
import { setEventFilter, setEvents, addEvent } from '../modules/actions';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const styles = {
  minHeight: '100vh',
  backgroundColor:'black'
}

class Main extends Component {
  constructor() {
    super()
    this.state = {
      synchronized: false,
    }
    this._addEvent = this._addEvent.bind(this);
  }

  _addEvent(e){
    this.props.addEvent(e);
  }
  componentDidMount() {
    const addTheEvent = this._addEvent;

    try {
      this.props.contract.events.allEvents({
          fromBlock: 3670373,
        }, )
        .on('changed', function(e){
          console.log(e)
        }).on('data', function(e){
          addTheEvent(e);
        }).on('error', function(e){
          console.log(e)
        });
      } catch (e) {
        //error setting up listener
        console.log(e)
      }

  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
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
                <DigitalClock switchState={this.props.coinState.switchState}/>
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
                      <div><a href={`http://kovan.etherscan.io/address/${this.props.coinState.address}`} target="_blank" >{this.props.coinState.address}</a></div>
                    </div>}
            </Grid.Column>
          </Grid>
        </Segment>
          <Grid inverted stackable columns={2}>
            <Grid.Column>
                <TotalSupply name={"Total Supply"} value={this.props.coinState.totalSupply}/>
            </Grid.Column>
            <Grid.Column>
                <TotalSupply name={"Available For Auction"} value={this.props.coinState.availableForAuction}/>
            </Grid.Column>
          </Grid>

          <Segment inverted>
            <EventMenu eventFilter={this.props.eventFilter} setEventFilter={this.props.setEventFilter} coinState={this.props.coinState}/>
          </Segment>

          <Dimmer
             active={typeof(this.props.coinState.address) === 'undefined'}
             page
           >
           <Header as='h2' icon>
             <Loader className="Loader">Retrieving Smart Contract Info...</Loader>
           </Header>
         </Dimmer>
        </div>
    </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
      eventFilter:state.eventFilter,
      coinState:state.coinState,
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
