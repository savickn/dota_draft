
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Nav, Button, ButtonGroup, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'


import styles from './Pagination.scss';

export class Pagination extends Component {

  // could add 'pageCount' as a 'state' variable

  // change current page (e.g. first vs. last)
  handlePageChange = (selectedPage) => {
    // guards against case where 'selectedPage' is '...'
    if(selectedPage === '...') {
      return;
    }

    console.log('selectedPage', selectedPage);
    const pageCount = Math.ceil(this.props.collectionSize / this.props.pageSize)
    if(selectedPage < 1) selectedPage = 1; // guards against invalid page
    if(selectedPage > pageCount) selectedPage = pageCount; // guards against invalid page
    this.props.changePagination({
      currentPage: selectedPage, 
      pageSize: this.props.pageSize, 
    });
  }

  // change number of items displayed on one page
  handleSizeChange = (pageSize) => {
    console.log('pageSize', pageSize);
    this.props.changePagination({
      currentPage: this.props.currentPage,
      pageSize: pageSize, 
    })
  }

  /* UI METHODS */

  // used to determine which pages to include as buttons
  getButtonArray = (pageCount, currentPage) => {
    // PRECONDITIONS:
    // always draw 10 buttons

    if(pageCount <= 10) {
      return [...Array(pageCount).keys()].map(x => ++x);
    }

    const nums = [];

    const skipToFirst = currentPage > 5;
    const skipToLast = pageCount > 10 && pageCount - currentPage > 4;

    if(skipToFirst && skipToLast) {
      nums.push(1);
      nums.push('...');
      nums.push(currentPage - 2);
      nums.push(currentPage - 1);
      nums.push(currentPage);
      nums.push(currentPage + 1);
      nums.push(currentPage + 2);
      nums.push(currentPage + 3);
      nums.push('...');
      nums.push(pageCount);
    } else if (!skipToFirst && skipToLast) {
      for(let n of [...Array(8).keys()]) {
        nums.push(n + 1);
      }
      nums.push('...');
      nums.push(pageCount);
    } else if (skipToFirst && !skipToLast) {
      nums.push(1);
      nums.push('...');
      for(let n of [...Array(8).keys()].reverse()) {
        nums.push(pageCount - n);
      }
    }

    return nums;
  }

  // checks if the Pagination menu should render
  shouldRender = () => {
    if(!this.props.collectionSize) return false;
    if(this.props.collectionSize <= this.props.pageSize) return false;
    return true; 
  }

  render() {
    if(!this.shouldRender()) return <div></div>

    console.log('pagination --> ', this.props);

    const pageCount = Math.ceil(this.props.collectionSize / this.props.pageSize);
    
    const nums = this.getButtonArray(pageCount, this.props.currentPage);

    return (
      <div>
        <Nav variant='pills' activeKey={this.props.currentPage} className={styles.pageContainer}>
          <Nav.Item>
            <Nav.Link eventKey={0}  onSelect={() => this.handlePageChange(this.props.currentPage - 1)}>
              <FontAwesomeIcon icon={faCaretLeft}/>
            </Nav.Link>
          </Nav.Item>
          {
            nums.map((num) => {
              return (
                <Nav.Item>
                  <Nav.Link eventKey={num} onSelect={() => this.handlePageChange(num)}> {num} </Nav.Link>
                </Nav.Item>
              );
            })
          }
          <Nav.Item>
            <Nav.Link eventKey={nums.length + 1}  onSelect={() => this.handlePageChange(this.props.currentPage + 1)} >
              <FontAwesomeIcon icon={faCaretRight}/>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {this.props.pageSizeIsChangeable && 
          <Nav> 
            <NavDropdown title={`Items per page`} id="nav-dropdown" activeKey={this.props.pageSize} onSelect={this.handleSizeChange}>
              {
                this.props.pageSizeOptions.map((val, idx) => {
                  return <NavDropdown.Item eventKey={val}>{val}</NavDropdown.Item>
                })
              }
            </NavDropdown>
          </Nav>
        }
      </div>
    );
  }
}

Pagination.defaultProps = {
  pageSizeIsChangeable: false,
  pageSizeOptions: [12, 24, 48], 
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  collectionSize: PropTypes.number.isRequired,
  changePagination: PropTypes.func.isRequired, 
  
  pageSize: PropTypes.number.isRequired,
  pageSizeIsChangeable: PropTypes.bool.isRequired, // for set or changeable page size
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired, // available pageSize options
};


export default Pagination;
