
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavDropdown, } from 'react-bootstrap';

import styles from './Header.scss';


//import {isEmpty} from '../../../../util/utilFuncs';

export default class Header extends React.Component {

  handleClick = (e) => {
    this.props.logOut();
  }

  render() {
    const isLoggedIn = this.props.authStatus === 'authenticated'; //isEmpty(props.currentUser) ? true : false;
    console.log('isLoggedIn? --> ', isLoggedIn);

    const header = `${styles['header']}`;

    /*const header = `${styles['flex-navbar-background']}`;
    const navbar = `${styles['flex-navbar']} container`;
    const logo = `${styles['site-title']} ${styles['flex-logo']}`;
    const links = `${styles['flex-links']}`;
    const element = `${styles['flex-element']}`;*/

    return (
      <React.Fragment>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Link to="/">
              dota-draft
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {!isLoggedIn &&
                <LinkContainer to="/users/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              }
              {!isLoggedIn &&
                <LinkContainer to="/users/new">
                  <Nav.Link>Create Account</Nav.Link>
                </LinkContainer>
              }
              {isLoggedIn && 
                <LinkContainer to="/users/profile">
                  <Nav.Link> Profile </Nav.Link>
                </LinkContainer>
              }
              {isLoggedIn && 
                <LinkContainer to="/users/watchlist">
                  <Nav.Link> Watchlist </Nav.Link>
                </LinkContainer>
              }
              {isLoggedIn && 
                <Nav.Link onClick={this.handleClick}> Log Out </Nav.Link>
              } 
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}


Header.contextTypes = {
  router: PropTypes.object,
};

Header.propTypes = {
  logOut: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  authStatus: PropTypes.string.isRequired,
};

