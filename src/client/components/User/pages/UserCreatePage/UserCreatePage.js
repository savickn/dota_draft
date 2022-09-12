import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import styles from './UserCreatePage.scss';

//import axios from '../../../../util/axiosCaller';

import { signUpRequest } from '../../UserActions';

import { getUserErrors } from '../../UserReducer';

export class UserCreatePage extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }

  /* VALIDATION */

  validateEmail = (elem) => {
    //var regex = /[A-Za-z0-9]+@[A-Za-z]+(//.[A-Za-z])+/;
    if(regex.test(elem.value)) {
      elem.setCustomValidity("");
      return true;
    } else {
      elem.setCustomValidity("The email address format is incorrect. Please provide an email address in the format of 'example@example.com'.");
      return false;
    };
  }

  testPasswordLength = () => {
    const password = this.state.password;
    return password.length >= 6 ? true : false;
  }

  passwordHasNumber = () => {
    const password = this.state.password;
    const regex = /[0-9]/;
    return regex.test(password) ? true: false;
  }

  passwordHasSpecialCharacter = () => {
    const password = this.state.password;
    const regex = /(\$|\&|\*|\+|\^|@)/;
    return regex.test(password) ? true: false;
  }

  canBeSubmitted = () => {
    const {name, email, password} = this.state;
    return (name.length > 0 && email.length > 0 && password.length > 0);
  }

  /* HANDLERS */

  handleNameChange = (se) => {
    this.setState({name: se.target.value});
  }

  handleEmailChange = (se) => {
    this.setState({email: se.target.value});
  }

  handlePasswordChange = (se) => {
    this.setState({password: se.target.value});
  }

  handleSubmit = (se) => {
    se.preventDefault();
    if(!this.canBeSubmitted()) { return; };
    const {name, email, password} = this.state;
    this.props.dispatch(signUpRequest({name, email, password}))

    // figure out how to clear Component state upon SIGN_UP_SUCCESS (can tie state to localStorage and clear localStorage from 
    // Reducer after SUCCESS event)
    // figure out how to change Router location from Redux in response to SIGN_UP_SUCCESS

    /*var response = this.props.dispatch(signUpRequest({name, email, password}));
    response.payload.then((res) => {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.props.dispatch(logInSuccess(res.data.user));
      this.context.router.push('/');
    }).catch((err) => {
      console.log('error', err.response);
      this.props.dispatch(logInFailure(err.response.data));
    })*/
  }

  /* LIFECYCLE METHODS */

  render() {
    const isEnabled = this.canBeSubmitted();
    const passwordLengthRequirement = this.testPasswordLength();
    const passwordNumberRequirement = this.passwordHasNumber();
    const passwordSpecialCharacterRequirement = this.passwordHasSpecialCharacter();

    // CSS Classes //
    const invalidGlyph = `${styles['invalid']} glyphicon glyphicon-remove`;
    const validGlyph = `${styles['valid']} glyphicon glyphicon-ok`;

    const hasErrors = this.props.errors ? true : false; //&& this.props.errors.length > 0;
    console.log(hasErrors, this.props.errors);

    // can assign errors to specific fields, example below
    /* const genericError = this.props.errors.generic;
    const nameError = this.props.errors.name;
    const emailError = this.props.errors.email;
    const passwordError = this.props.errors.password;*/

    // or can base errors on Error.name while iterating through an Array
    /* this.props.errors.forEach((err) => {
      
    })
    const genericError = this.props.errors.name 
    */

    return (
      <div>
        <Helmet title='Create a new account.' />
        {hasErrors &&
          <div id='generalError'>
            {this.props.errors.name} : {this.props.errors.message}
          </div>
        }
        <form name='userForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Name: </label>
            <input type='text' name='userName' value={this.name} onChange={this.handleNameChange} placeholder='John Doe' className='form-control' id='name' required></input>
            {hasErrors &&
              <div id='nameErrors'>
                {/*this.props.errors.name*/}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email: </label>
            <input type='email' name='userEmail' value={this.email} onChange={this.handleEmailChange} placeholder='johndoe@example.com' className='form-control' id='email' pattern='[A-Za-z0-9]+@[A-Za-z]+.?[A-Za-z]+' required></input>
            {hasErrors &&
              <div id='emailErrors'>
                {this.props.errors.email}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password: </label>
            <input type='password' name='userPassword' value={this.password} onChange={this.handlePasswordChange} className='form-control' id='password' required></input>
            <div id='passwordInfo'>
              <p>{passwordLengthRequirement ? (<span className={validGlyph}></span>) : (<span className={invalidGlyph}></span>)}
                Must be at least 6 characters long.
              </p>
              <p>{passwordSpecialCharacterRequirement ? (<span className={validGlyph}></span>) : (<span className={invalidGlyph}></span>)}
                Must contain a special character.
              </p>
              <p>{passwordNumberRequirement ? (<span className={validGlyph}></span>) : (<span className={invalidGlyph}></span>)}
                Must contain at least one number.
              </p>
            </div>
            {hasErrors &&
              <div id='passwordErrors'>
                {this.props.errors.password}
              </div>
            }
          </div>
          <button type="submit" disabled={!isEnabled} className='btn btn-md btn-default'>Submit</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: getUserErrors(state),
  };
}

UserCreatePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

UserCreatePage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(UserCreatePage);

//export default injectIntl(PostCreateWidget);
