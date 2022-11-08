
import { OPEN_MODAL, CLOSE_MODAL } from './modalActions';

let initialState = {
  isVisible: {},
  //childComponent: null
};

const ModalReducer = (state = initialState, action) => {
  switch(action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        isVisible: {
          ...state.isVisible,
          [action.id]: true, 
        }
      };
    case CLOSE_MODAL:
      return {
        ...state,
        isVisible: {
          ...state.isVisible,
          [action.id]: false, 
        }
      };
    default:
      return state;
  }
};

export const getVisibility = (state, id) => state.modal.isVisible[id];
//export const getComponent = state => state.modal.childComponent;

export default ModalReducer;
