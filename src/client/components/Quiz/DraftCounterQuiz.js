
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// show enemy draft and ask for counter-pick
class DraftCounterQuiz extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (<div></div>);
  }
}

DraftCounterQuiz.propTypes = {

};

const mapStateToProps = (state) => {
  return {
    
  };
};

export default connect(mapStateToProps)(DraftCounterQuiz);