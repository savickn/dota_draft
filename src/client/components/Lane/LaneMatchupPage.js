
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as helpers from './helpers';

class LaneMatchupPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      safelane: [],
      offlane: [],
    };
  }

  componentDidMount() {

  }


  render() {

    return (
      <div className='flex-column'>
        
      </div>
    )
  }
}

LaneMatchupPage.propTypes = {

};

const mapStateToProps = (state) => {
  return {

  };
};

export default connect(mapStateToProps)(LaneMatchupPage);