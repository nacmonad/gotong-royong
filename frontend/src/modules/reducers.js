export const eventFilter = (state = 'All', action) => {
  switch (action.type) {
    case 'SET_EVENT_FILTER':
      return action.filter
    default:
      return state
  }
}

export const events = (state = [], action) => {
  switch (action.type) {
    case 'ADD_EVENT':
      let arr = state;
      arr.push(action.event);
      return arr
    case 'SET_EVENTS':
      arr = action.events;
      return arr
    default:
      return state
  }
}

export const coinState = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE_COIN_STATE':
      return { ...action.coinState}
    default:
      return state
  }
}
