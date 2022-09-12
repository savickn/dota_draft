
import { OPEN_MODAL, CLOSE_MODAL } from './modalActions';

let initialState = {
  isVisible: false,
  //childComponent: null
};

const ModalReducer = (state = initialState, action) => {
  switch(action.type) {
    case OPEN_MODAL:
      return Object.assign({}, state, {
        isVisible: true,
        //childComponent: action.component
      });
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        isVisible: false,
        //childComponent: null
      });
    default:
      return state;
  }
};

export const getVisibility = state => state.modal.isVisible;
//export const getComponent = state => state.modal.childComponent;

export default ModalReducer;