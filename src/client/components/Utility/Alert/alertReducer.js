
const SET_ALERT = 'SET_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';
const SHIFT_QUEUE = 'SHIFT_QUEUE';

// add support for Flash messages on Route Change
// maybe add some sort of queue
let initialState = {
  queue: [],
  message: null,
  type: null
}

/* Type can be
* Success
* Warning
* Error
* None -> dont display Alert
*/

const AlertReducer = (state=initialState, action) => {
  switch(action.type) {
    case SET_ALERT:
      return Object.assign({}, state, {
        message: action.alert.message,
        type: action.alert.type
      });
    case SHIFT_QUEUE:
      return Object.assign({}, state, {
        queue: action.queue,
      });
    case REMOVE_ALERT:
      return Object.assign({}, state, {
        message: null,
        type: null
      });
    default: 
      return state;
  }
}

export const getType = (state) => state.alerts.type;
export const getMessage = (state) => state.alerts.message; 
export const getQueueLength = (state) => state.alerts.queue.length; //

export default AlertReducer;
