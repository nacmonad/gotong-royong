import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all, fork} from 'redux-saga/effects';

import { coinState, eventFilter } from './modules/reducers';
import * as mySagas from './modules/sagas';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const sagaMiddleware = createSagaMiddleware();

//maps each saga from objectSaga into the rootSaga
function* rootSaga() {
  try {
    yield all([
      ...Object.values(mySagas),
    ].map(fork));
    } catch (err) {
      console.log(err)
    }
}



const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware),
  // other store enhancers if any
);

export default createStore(
    combineReducers({ coinState, eventFilter }),
    enhancer
  );

sagaMiddleware.run(rootSaga);
