
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './modal.module.scss';

import { closeModal } from './modalActions';
import { getVisibility } from './modalReducer';

class Modal extends React.Component {
  
  constructor(props) {
    super(props);
    //console.log('modal props --> ', props);
    this.modalRef = React.createRef();
  }

  hideModal = (se) => {
    //console.log('modalClick --> ', se.target);
    //console.log('modalRef --> ', this.modalRef.current);
    if(se.target === this.modalRef.current) {
      this.props.dispatch(closeModal());
    }
  }
  
  render() {
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
  //close: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isVisible: getVisibility(state),
    //child: getComponent(state)
  }
}

export default connect(mapStateToProps)(Modal);


