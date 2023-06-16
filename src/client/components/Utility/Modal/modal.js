
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './modal.scss';

import { closeModal } from './modalActions';
import { getVisibility } from './modalReducer';

// basic Modal implementation
// cant be inside of <div> for some reason (will change z-index)
class Modal extends React.Component {
  
  constructor(props) {
    super(props);
    this.modalRef = React.createRef();
  }

  hideModal = (se) => {
    //console.log('modalClick --> ', se.target);
    //console.log('modalRef --> ', this.modalRef.current);
    if(se.target === this.modalRef.current) {
      this.props.dispatch(closeModal(this.props.identifier));

      if(this.props.close) {
        this.props.close();
      }
    }
  }
  
  render() {
    //console.log('modal props -- ', this.props);

    //const modalCss = this.props.isVisible ? '' : '';
    return (
      <div>
        { this.props.isVisible && 
          <div className={styles['modal']} ref={this.modalRef} onClick={this.hideModal}>
            <div className={styles['modal-content']}>
              {this.props.children}
            </div>
          </div>
        }
      </div>
    );
  }
}

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  identifier: PropTypes.string.isRequired, 
  close: PropTypes.func, // for extra functionality when closing modal
};

const mapStateToProps = (state, props) => {
  return {
    isVisible: getVisibility(state, props.identifier),
    //child: getComponent(state)
  }
}

export default connect(mapStateToProps)(Modal);


