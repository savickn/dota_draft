import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { getCurrentUser } from '../../AccountReducer';

import styles from './UserProfilePage.scss';

export class UserProfilePage extends React.Component {

  /* UI logic */

  render() {
    if(!this.props.currentUser) return <div></div>; // should prob redirect instead

    return (
      <div className={styles.profileContainer}>
        Profile Page
      </div>
    );
  }
};

UserProfilePage.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, props) => {
  return {
    currentUser: getCurrentUser(state), 
  }
}

export default connect(mapStateToProps)(UserProfilePage);

