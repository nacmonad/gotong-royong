import React, { Component } from 'react';

import { Provider } from 'react-redux';

import Main from './components/Main';
import store from './store';
import Web3Provider from './components/Web3Provider';


class App extends Component {
  render() {
    return (
      <Provider store={store}>
          {Web3Provider(Main)}
      </Provider>
    );
  }
}

export default App;
