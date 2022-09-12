
export const LOG_IN = 'LOG_IN';
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';


/* LOG IN */

export function login(credentials) {
  return {
    type: LOG_IN,
    credentials
  };
}


export function logInRequest() {
  return {
    type: LOG_IN_REQUEST,
  };
}

// used to set 'currentUser' in Redux store
export function logInSuccess(user) {
  return {
    type: LOG_IN_SUCCESS,
    user,
  };
}

// used to set 'currentUser' in Redux store
export function logInFailure(errors) {
  return {
    type: LOG_IN_FAILURE,
    errors,
  };
}

/* LOG OUT */

// used to remove 'currentUser' in Redux store
export function logOut() {
  return {
    type: LOG_OUT,
  };
}


/* OLD */

// used to send LogOut request to server
/*export function logOutRequest(userId) {
  return (dispatch) => {
    return callApi('users', 'post', {
      post: {
        name: post.name,
        title: post.title,
        content: post.content,
      },
    }).then(res => dispatch(LogOut(res.user.id)));
  };
}

// used to send Login request to server, also 'credentials' must have both an 'email' and 'password' field
export function logInRequest(credentials) {
  return (dispatch) => {
    return callAuth('local', 'post', {
      email: credentials.email,
      password: credentials.password,
    }).then(res => dispatch(LogIn(res.user)));
  };
}

*/

// used to send Login request to server, also 'credentials' must have both an 'email' and 'password' field
// uses Redux-thunk
/*export function logInRequest(credentials) {
  const request = axios.post('auth/local/', {
    email: credentials.email,
    password: credentials.password,
  });

  return {
    type: LOG_IN,
    payload: request,
  };
}*/
