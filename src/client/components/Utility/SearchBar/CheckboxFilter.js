
import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCircle, faCheckCircle, faCaretDown, } from '@fortawesome/free-solid-svg-icons'

import styles from './CheckboxFilter.scss';

class CheckboxFilter extends React.Component {

                              /* STATE METHODS */

  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      selectedOptions: [], 
    }
  }

  toggleShowFilter = () => {
    this.setState({showOptions: !this.state.showOptions});
  }

                              /* PARENT CALLBACKS */

  // used to pass checkbox changes to parent (e.g. SearchBar)
  handleCheckboxChanged = (option) => {
    console.log('handleCheckboxChanged --> ', option);
    let selected = this.state.selectedOptions;

    // add or remove checkbox 'option' from array
    selected.includes(option) 
      ? selected.splice(selected.indexOf(option), 1) 
      : selected.push(option);

    // save state then update parent
    this.setState({selectedOptions: selected}, () => {
      this.props.checkboxChanged(this.props.filter.name, this.state.selectedOptions);
    })
  }

                              /* UI METHODS */

  // used to style each Option
  isOptionSelected = (option) => {
    return this.state.selectedOptions.includes(option);
  }

  // used to show all Options
  showFilterOptions = () => {
    return this.state.showOptions ? styles.showOptions : styles.hideOptions;
  }

  render() {
    const showHideFilter = this.showFilterOptions();

    return (
      <div className={styles.checkbox}>
        <div className={styles.expandOptionsBtn} onClick={this.toggleShowFilter}>
          {this.props.filter.name}   <FontAwesomeIcon icon={faCaretDown} />
        </div>
        <div className={showHideFilter}>
          {this.props.filter.options && this.props.filter.options.map((option) => {
            return (
              <div className='click-cursor' onClick={() => this.handleCheckboxChanged(option)}>
                <FontAwesomeIcon icon={this.isOptionSelected(option) ? faCheckCircle : faCircle} /> {option}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

CheckboxFilter.propTypes = {
  filter: PropTypes.objectOf({
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string), 
  }).isRequired,
  checkboxChanged: PropTypes.func.isRequired, 
}

export default CheckboxFilter;