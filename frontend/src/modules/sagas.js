import {delay} from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import store from '../store';
import {web3} from '../config'

const BN = web3.utils.BN;

function parseCoinState(action) {
  console.log("parsing something...")
  console.log(action)
  //get timestamp of new block
  const stateCopy = Object.assign({}, store.getState().coinState);
  switch(action.event.event) {
    case "SwitchEvent":
      stateCopy.switchState = action.event.returnValues.newState ? true : false;  //newState can be undefined, so return false
      break;
    case "TokensAdded":
      stateCopy.totalSupply = new BN(stateCopy.totalSupply).add(new BN(action.event.returnValues[0])).toString();
      stateCopy.availableForAuction = new BN(stateCopy.availableForAuction).add(new BN(action.event.returnValues[0])).toString();
      break;
    default:
      break;
  }
  return stateCopy;
}

// Our worker Saga: will perform the async increment task
function* parseEventEffects(action) {
  const newCoinState = yield call(parseCoinState, action);
  yield put({ type: 'COINSTATE_UPDATE', newCoinState });
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchAddEvent() {
  yield takeEvery('ADD_EVENT', parseEventEffects)
}



async function timestampsFromBlocks(action) {
  const stateCopy = Object.assign({}, store.getState().coinState);
  try {
    await action.coinState.pastEvents.map((e,i)=>{
          web3.eth.getBlock(e.blockNumber).then((res)=>{
            stateCopy.pastEvents[i].timestamp = res.timestamp
       })
       return stateCopy.pastEvents[i].timestamp
    });
    return stateCopy;
  } catch (e) {
    console.log(e)
  }
}

function* populateTimestamps(action) {
    const stateCopy = yield call(timestampsFromBlocks, action);
    yield delay(0)
    yield put({ type: 'COINSTATE_UPDATE', newCoinState:stateCopy });
}

export function* watchInitialize() {
  yield takeEvery('INITIALIZE_COIN_STATE', populateTimestamps);
}
