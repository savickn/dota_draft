
import React from 'react';
import PropTypes from 'prop-types';

import { Nav, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons'

import styles from './SearchBar.scss';

import CheckboxFilter from './CheckboxFilter';


class SearchBar extends React.Component {
  
                            /* LIFECYCLE METHODS */

  constructor(props) {
    super(props);
    console.log('searchBar props --> ', props);

    this.state = {
      advancedSearch: false, // used to control whether expandable search options are visible 
      filterable: props.filterMap ? true : false,
      sortable: props.sortingMap ? true : false,

      currentSort: props.sortingMap.default || '',

      search: {}, // contains the current search query

    };

    this.searchRef = React.createRef();
  }

  componentDidMount() {
    if(typeof window !== undefined) {
      const searchObj = window.localStorage.getItem(this.props.id);
      if(searchObj) {
        const obj = JSON.parse(searchObj);
        console.log('searchBar localStorage --> ', obj);

        //this.props.searchFunc();
      }
    } 
  }


                            /* STATE METHODS */

  // used to show/hide advanced search options
  toggleAdvancedSearch = (evt) => {
    this.setState({advancedSearch: !this.state.advancedSearch});
  }

  // used to open filter Modal
  openFilterOptions = (evt) => {

  }


                              /* FILTERING */

  // for boolean options??

  // for slider options
  handleSliderChange = (name, min, max) => {
    console.log('searchBar handleSliderChange --> ', name, min, max);

  }

  // for checkbox options, WORKING
  handleCheckboxChange = (name, arr) => {
    console.log('searchBar handleCheckboxChange --> ', name, arr);
    const searchObj = Object.assign({}, this.state.search, { [name.toLowerCase()]: arr })
    this.setState({search: searchObj});
  }

                              /* SORTING */

  handleSortOptionSelected = () => {
    
  }

                              /* SEARCH */

  handleSearch = () => {
    console.log('searchObj --> ', this.state.search);
    console.log('searchRef --> ', this.searchRef);

    let text = this.searchRef.current.value || '';
    const searchObj = Object.assign({}, this.state.search, {name: text});

    // save to localStorage
    window.localStorage.setItem(this.props.id, JSON.stringify(searchObj));

    this.props.searchFunc(searchObj);

    /*if(this.searchRef.current.value) {
      this.props.simpleSearch(this.searchRef.current.value);
    }*/
  }

                              /* UI METHODS */

  hasSearchText = () => {
    return this.searchRef.current && this.searchRef.current.value.length > 0;
  }

  render() {
    //const hasSearchText = this.hasSearchText();
    //${hasSearchText ? 'click-cursor' : 'disabled-cursor'}

    return (
      <React.Fragment>
        <div className={styles.headerSection}>
          <div id='advanced-search-toggle' onClick={this.toggleAdvancedSearch}>
            <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} />
          </div>

          <div className={`input-group click-cursor`}>
            <div className='input-group-prepend' onClick={this.handleSearch}>
              <span className='input-group-text' id='basic-addon1'>
                <FontAwesomeIcon icon={faSearch} /> 
              </span>
            </div>
            <input type='search' name='search' ref={this.searchRef} 
              placeholder='Text Search' className='form-control' aria-describedby='basic-addon1' />
          </div>
          
          <Dropdown>
            <Dropdown.Toggle variant='secondary' id="sort-dropdown">
              {this.state.currentSort} 
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {this.props.sortingMap && Object.keys(this.props.sortingMap).map((key, idx) => {
                return <Dropdown.Item eventKey={idx}> {key} </Dropdown.Item> 
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        
        <div id='advanced-search-collapsable' className={this.state.advancedSearch ? styles.showCollapsable : styles.hideCollapsable}>
          <div className={styles.filters}>
            {this.props.filterMap && this.props.filterMap.map((filter) => {
              if(filter.type === 'checkbox') {
                return <CheckboxFilter filter={filter} checkboxChanged={this.handleCheckboxChange}/>
              }
            })}
          </div>
          <div id='selected-filters'>
            
          </div>
        </div>
      </React.Fragment>
    );
  }
}

SearchBar.propTypes = {
  id: PropTypes.string.isRequired, 

  /* search callbacks */
  simpleSearch: PropTypes.func, // basic text search
  advancedSearch: PropTypes.func, // text search with additional options
  searchFunc: PropTypes.func.isRequired, 

  /* advanced search data */
  filterMap: PropTypes.objectOf(/* ??? */), 
  sortingMap: PropTypes.objectOf(/* ??? */)
}

export default SearchBar; 


/*
  filterMap = [
    0: {
      name: 'Site',
      type: 'checkbox',
      func: handleChangeSite,
      options: ['br', 'gap'], 
    },
    1: {
      name: 'Category',
      type: 'checkbox',
      func: handleChangeCategory,
      options: ['jeans', 'chinos', 'sweaters', 'button-downs', 't-shirts']
    }
    2: {
      name: 'Size',
      etc
    },
    3: {
      name: 'color',
      etc
    },
    4: {
      name: 'price',
      etc, 
    }
  ]
*/
