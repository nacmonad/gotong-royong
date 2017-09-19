import React from 'react';
import {web3, Contract} from '../config';
import store from '../store';

export default (ChildComponent) => {
  console.log(web3)
  console.log(Contract)
  try {
    let get = async () => {
      return {
        address: Contract._address,
        host: Contract._provider.host,
        blockNo: await web3.eth.getBlockNumber(),
        totalSupply: await Contract.methods.totalSupply().call(),
        availableForAuction: await Contract.methods.getAvailableForAuction().call(),
        rate: await Contract.methods.getRate().call(),
        switchState: await Contract.methods.getSwitchState().call(),
        owner: await Contract.methods.owner().call(),
        pastEvents: await Contract.getPastEvents('allEvents', {
            fromBlock: 1599518,
            toBlock: 'latest'
        })
      }
    }
    get().then((res)=>{
      store.dispatch({type:"INITIALIZE_COIN_STATE", coinState:res});
    })
  } catch (e) {
    console.log(e)
  }


  //setup event listeners

  return (
        <ChildComponent web3 = {web3} contract={Contract}/>
      )
}
