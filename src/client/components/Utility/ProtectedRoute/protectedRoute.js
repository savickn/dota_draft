
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { isAuthenticated, hasRole, isCorrectUser, getAccountStatus } from '../../User/AccountReducer';

/* Auth Types: 
* Must be Admin (easy, working)
* Must be logged in (easy, working)
* Must be a specific user  
*/


// add support for -- roles, alert messages
// also try to make Redux middleware for authentication
// seems to be working pretty well
/*  
* 
*/
class ProtectedRoute extends React.Component {

  // saves 'path' to localStorage if not authorized to resume browsing on the same page if login is successful
  testAuth = () => {
    const isAuth = this.props.authenticated && this.props.authorized; /*&& this.props.isCorrectUser;*/

    if(typeof window !== undefined) {
      !isAuth ? localStorage.setItem('ProtectedRoute', this.props.location.pathname) : localStorage.removeItem('ProtectedRoute');
    }
    return isAuth ? <Route {...this.props} /> : <Redirect to={{ pathname: '/users/login' }} />; 
  }

  render() {
    const isLoading = this.props.status === 'loading';

    /*console.log('protected route props --> ', this.props);
    console.log('role --> ', this.props.role);
    console.log('authenticated? --> ', this.props.authenticated);
    console.log('authorized? --> ', this.props.authorized);*/

    /* Cases:
    * User is unauthenticated
    * User is unauthorized
    * User is authenticated by must retrieve token from localStorage
    */

    // used to avoid redirect until Login attempt either passes or fails after page refresh
    if(isLoading) {
      return <div>loading...</div>
    } else {
      return this.testAuth();
    }
  }
};

ProtectedRoute.defaultProps = {
  role: 'user',
};

ProtectedRoute.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.object.isRequired,
  exact: PropTypes.bool,
  /**********/
  checkRole: PropTypes.string,
  checkAuth: PropTypes.string, 
  checkIdentity: PropTypes.string,  
  authFunc: PropTypes.func, // used for custom auth (e.g. is a specific user)
};

const mapStateToProps = (state, props) => {
  return {
    status: getAccountStatus(state),
    authenticated: isAuthenticated(state),
    authorized: hasRole(state, props.role),
    //correctUser: isCorrectUser(state, props.match.params.userId), // not very reusable tho
  };
};

export default connect(mapStateToProps)(ProtectedRoute);


/*const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
     props.isAuthenticated === true ? 
        <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />   
  )} />
);*/
