
import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

import { getMessage, getType } from './alertReducer';

export class AlertComponent extends React.Component {
  render() {
    return this.props.type ? (
      <div>
        <Alert bsStyle={this.props.type}>
          {this.props.message}
        </Alert>;
      </div>
    ) : (<div></div>)
  }
}

const mapStateToProps = (state) => {
  return {
    message: getMessage(state),
    type: getType(state)
  };
}

export default connect(mapStateToProps)(AlertComponent);
