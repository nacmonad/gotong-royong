import { combineReducers, createStore } from 'redux';
import { coinState, eventFilter, events } from './modules/reducers';

export default createStore(
    combineReducers({coinState, eventFilter, events}),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
