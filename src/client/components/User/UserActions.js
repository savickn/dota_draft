
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';


/* SIGN UP / ACCOUNT CREATION */

export function signUpRequest(userData) {
  return {
    type: SIGN_UP_REQUEST,
    userData,
  };
}

export function signUpSuccess(user) {
  return {
    type: SIGN_UP_SUCCESS,
    user,
  };
}

export function signUpFailure(errors) {
  return {
    type: SIGN_UP_FAILURE,
    errors,
  };
}

/* USER QUERIES */

export function fetchUsersRequest(query) {
  return {
    type: FETCH_USERS_REQUEST,
    query,
  }
}

export function fetchUsersSuccess(users) {
  return {
    type: FETCH_USERS_SUCCESS,
    users,
  }
}

export function fetchUsersFailure(errors) {
  return {
    type: FETCH_USERS_FAILURE,
    errors,
  }
}

/* UPDATE USER */

export function updateUserRequest(userData) {
  return {
    type: UPDATE_USER_REQUEST,
    userData,
  }
}

export function updateUserSuccess(user) {
  return {
    type: UPDATE_USER_SUCCESS,
    user,
  }
}

export function updateUserFailure(errors) {
  return {
    type: UPDATE_USER_FAILURE,
    errors,
  }
}

/* DELETE USER */

export function deleteUserRequest(id) {
  return {
    type: DELETE_USER_REQUEST,
    id,
  };
}

export function deleteUserSuccess(id) {
  return {
    type: DELETE_USER_SUCCESS,
    id,
  };
}

export function deleteUserFailure(errors) {
  return {
    type: DELETE_USER_FAILURE,
    errors,
  };
}



/* OLD */

/*export function addUser(user) {
  return {
    type: ADD_USER,
    user,
  };
}

export function addUsers(users) {
  return {
    type: ADD_USERS,
    users,
  };
}*/


/*
export function addUserRequest(user) {
  return (dispatch) => {
    return callApi('users', 'post', {
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    }).then((res) => {
      console.log('add user success', res.user);
      dispatch(addUser(res.user));
    }).catch((errors) => {
      console.log('add user error', errors);
      return errors;
    });
  };
}

export function addUserRequest(user) {
  return (dispatch) => {
    return axios.post('api/users/', {
      name: user.name,
      email: user.email,
      password: user.password,
    });
  };
}

export function signUp(user) {
  const request = axios.post('api/users/', {
    name: user.name,
    email: user.email,
    password: user.password,
  });

  return {
    type: SIGN_UP,
    payload: request,
  };
}

*/

// used to create a new User + login
// uses Redux-thunk
/*export function signUpRequest(user) {
  const request = axios.post('api/users/', {
    name: user.name,
    email: user.email,
    password: user.password,
  });

  return {
    type: SIGN_UP,
    payload: request,
  };
}*/

// using redux-thunk
/*export function fetchUsers() {
  return (dispatch) => {
    return axios('users').then(res => {
      dispatch(addUsers(res.users));
    });
  };
}

// potentially buggy
export function fetchUser(cuid) {
  return (dispatch) => {
    return axios(`users/${cuid}`).then(res => dispatch(addUser(res.user)));
  };
}*/

/* DELETE USERS */

// using redux-thunk
/*export function deleteUserRequest(cuid) {
  return (dispatch) => {
    return axios(`users/${cuid}`, 'delete').then(() => dispatch(deleteUser(cuid)));
  };
}*/