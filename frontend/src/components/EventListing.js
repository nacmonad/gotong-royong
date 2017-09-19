import React from 'react';
import {Feed, Grid, Icon} from 'semantic-ui-react';
import Paper from 'material-ui/Paper';
import TimeAgo from 'react-timeago';

export default ({id, event, transactionHash, signature, blockNumber, returnValues, timestamp, index}) =>{
    return (
      <Paper zDepth={3} key={id} style={{marginBottom:'38px'}}>
        <Feed.Event >
          <Feed.Content>
              <Grid>
                  <Grid.Column width={10} >
                      <Grid.Row>
                        <Feed.Label style={{paddingBottom:0}}>

                          {timestamp ?
                            <Feed.Date><Icon name="alarm outline"/> {event} <TimeAgo style={{float:'right'}} date={new Date(timestamp*1000)} /></Feed.Date> :
                            <Feed.Date><Icon name="alarm outline"/> {event} </Feed.Date>  }

                        </Feed.Label>
                        <Feed.User style={{paddingTop:0}} href={`http://kovan.etherscan.io/tx/${transactionHash}`} target="_blank">
                          {transactionHash}
                        </Feed.User>

                      </Grid.Row>

                        <Grid.Column width={4} >
                          <Feed.Summary>
                            <Feed.Date>{blockNumber}</Feed.Date>

                          </Feed.Summary>
                        </Grid.Column>
                        <Grid.Column  width={6} style={{position:'relative', float:'right', top:'-1.5em'}}>
                            Some next stuff
                        </Grid.Column>

                  </Grid.Column>
                  <Grid.Column floated='right' width={6} >
                    <Feed.Meta>
                        {JSON.stringify(returnValues)}
                    </Feed.Meta>
                    {/*<Button inverted color='red' icon='remove' style={{float:'right'}} onClick={store.dispatch.bind(null,{type:"REMOVE_EVENT", index:i})}/>*/}
                  </Grid.Column>
              </Grid>
          </Feed.Content>
        </Feed.Event>
      </Paper>
    )
}
