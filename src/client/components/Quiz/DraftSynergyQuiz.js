
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// show allied draft and ask for synergistic-pick
class DraftSynergyQuiz extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (<div></div>);
  }
}

DraftSynergyQuiz.propTypes = {

};

const mapStateToProps = (state) => {
  return {
    
  };
};

export default connect(mapStateToProps)(DraftSynergyQuiz);