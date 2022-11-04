import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';


import styles from './HomePage.scss';

//import { getAccountStatus, getCurrentUser } from '../../../User/AccountReducer';

class HomePage extends React.Component {
  
  render() {
    return (
      <div className="flex-column">
        <Link to='/heroes'>Heroes</Link>
        <Link to='/draft'>Draft Simulator</Link>
        <Link to='/lane'>Lane Analysis</Link>
        <Link to='/visualizer'>Visualizer</Link>
        <Link to='/quiz'>Quiz</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    //authStatus: getAccountStatus(state),
    //currentUser: getCurrentUser(state),
  };
}

/*
HomePage.propTypes = {
  authStatus: PropTypes.string.isRequired,
};*/

HomePage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(HomePage);
