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
        owner: await Contract.methods.owner().call()
      }
    }
    get().then((res)=>{
      store.dispatch({type:"INITIALIZE_COIN_STATE", coinState:res});
    })
    console.log(Contract.options.address)
    // web3.eth.getBlockNumber().then(console.log)
    // Contract.methods.totalSupply().call().then(console.log)
    // Contract.methods.getAvailableForAuction().call().then(console.log)
    // Contract.methods.getRate().call().then(console.log)
    // Contract.methods.getSwitchState().call().then(console.log)
  } catch (e) {
    console.log(e)
  }


  //setup event listeners

  return (
        <ChildComponent contract={Contract}/>
      )
}
