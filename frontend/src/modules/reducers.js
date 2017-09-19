export const eventFilter = (state = 'All', action) => {
  switch (action.type) {
    case 'SET_EVENT_FILTER':
      return action.filter
    default:
      return state
  }
}

export const coinState = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE_COIN_STATE':
      let arr = action.coinState;
      arr.pastEvents = arr.pastEvents.reverse();
      return { ...arr}
    case 'COINSTATE_UPDATE':
        return { ...action.newCoinState }
    case 'ADD_EVENT':
        return {
            ...state,
            blockNo:action.event.blockNumber,
            pastEvents: [
              action.event,
              ...state.pastEvents
            ]
          }
      case 'REMOVE_EVENT':
          return {
              ...state,
              pastEvents: [
                ...state.pastEvents.slice(0, action.index),
                ...state.pastEvents.slice(action.index+1)
              ]
            }
    default:
      return state
  }
}
