export const setEventFilter = filter => {
  return {
    type: 'SET_EVENT_FILTER',
    filter
  }
}

export const setEvents = events => {
  return {
    type: 'SET_EVENTS',
    events
  }
}

export const addEvent = event => {
  return {
    type: 'ADD_EVENT',
    event
  }
}
export const removeEvent = event => {
  return {
    type: 'REMOVE_EVENT',
    event
  }
}


export const initializeCoinState = coinState => {
  return {
    type: 'INITIALIZE_COIN_STATE',
    coinState
  }
}
