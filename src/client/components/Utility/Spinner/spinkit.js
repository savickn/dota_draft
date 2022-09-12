
import React from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';

import { isLoading } from '../../App/AppReducer';

import styles from './spinkit.scss';

class SpinnerWidget extends React.Component {
  render() {
    return (
      <div className={styles['spinner-container']}>
        <Spinner name='circle' className={styles['spinner']} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    shouldRender: isLoading(state), 
  };
}

export default connect(mapStateToProps)(SpinnerWidget);



