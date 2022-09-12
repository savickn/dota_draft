import { LOADING, RESOLVED } from './AppActions';

// will show spinner if 'loading' is True
const initialState = {
  loading: true,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return {loading: true, };
    case RESOLVED:
      return {loading: false, };
    default:
      return state;
  }
};

export const isLoading = state => state.app.loading;

export default AppReducer;
