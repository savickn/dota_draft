import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import styles from './App.scss';
import routes from '../../routes';

//import DevTools from '../../util/devTools';
import Header from './components/Header/Header';

/*import Footer from './components/Footer/Footer';
import Alert from '../Utility/Alert/alert';
import Spinner from '../Utility/Spinner/spinkit';*/


/*
** ACTIONS
*/
import { logOut } from '../User/AccountActions';

/*
** REDUCERS
*/
import { getCurrentUser, getAccountStatus } from '../User/AccountReducer';
import { isLoading } from './AppReducer';


/* other */

import { heroDataRequest } from '../OpenDota/OpenDotaActions';

class App extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'RESOLVED'}); // used to remove Spinner after loading
    
    // attempt user auth from localStorage
    /*if(localStorage.getItem('authToken')) {
      this.props.dispatch({type: 'TOKEN_AUTH'});
    };*/

    // get openDota API data from localStorage
    this.props.dispatch(heroDataRequest());
  }

  logOut = () => {
    this.props.dispatch(logOut());
  };

  //{this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
  render() {
    return (
      <React.Fragment>
        <Helmet
          title="DOTA DRAFT"
          titleTemplate="%s - DOTA DRAFT"
          base={{
            href: '/',
          }}
          meta={[
            { charset: 'utf-8' },
            {
              'http-equiv': 'X-UA-Compatible',
              content: 'IE=edge',
            },
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
          ]}
          /*link={[
            {
              rel: 'stylesheet',
              href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
            },
            {
              rel: 'stylesheet',
              href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
            },
          ]}*/
        />
        { /* <DevTools /> */ }
        {
          this.props.isLoading ? <div>Loading...</div> :
          <div>
            <Header 
              currentUser={this.props.currentUser} 
              authStatus={this.props.authStatus} 
              logOut={this.logOut} 
            />
            <div className='container'>
              {routes}
            </div>
          </div>
        }
      </React.Fragment>
    );
  }
}

// <DevTools />

App.propTypes = {
  //children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(store) {
  return {
    currentUser: getCurrentUser(store),
    authStatus: getAccountStatus(store),
    isLoading: isLoading(store),
  };
}

export default withRouter(connect(mapStateToProps)(App));
