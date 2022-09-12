import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//import styles from './UserLoginPage.scss';

import { login } from '../../AccountActions';

import { getAccountErrors } from '../../AccountReducer';

export class UserLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  // Validation //

  canBeSubmitted = () => {
    const { email, password } = this.state;
    return (email.length > 0 && password.length > 0);
  }

  // Event Handlers //

  handleEmailChange = (se) => {
    this.setState({email: se.target.value});
  }

  handlePasswordChange = (se) => {
    this.setState({password: se.target.value});
  }

  handleSubmit = (se) => {
    se.preventDefault();
    if(!this.canBeSubmitted()) { return; }
    const {email, password} = this.state;
    this.props.dispatch(login({email, password}));

    /* when using Redux-thunk
    const request = this.props.dispatch(logInRequest({email, password}));
    request.payload.then((res) => {
      const token = res.data.token;
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      axios.get('api/users/me').then((res) => {
        const user = res.data;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.props.dispatch(logInSuccess(user));
        this.context.router.push('/');
      }).catch((err) => {
        console.log('getMe error', err.response);
      })
    }).catch((err) => {
      console.log('login error', err.response);
      this.props.dispatch(logInFailure(err.response.data));
    })*/
  };

  render() {
    const isEnabled = this.canBeSubmitted();
    //console.log('errors', this.props.errors);

    return (
      <div>
        <form name='loginForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email: </label>
            <input type='email' name='userEmail' value={this.email} onChange={this.handleEmailChange} placeholder='johndoe@example.com' className='form-control' id='email' required></input>
            {this.props.errors &&
              <div id='emailErrors'>
                {this.props.errors.email}
              </div>
            }
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password: </label>
            <input type='password' name='userPassword' value={this.password} onChange={this.handlePasswordChange} className='form-control' id='password' required></input>
            {this.props.errors &&
              <div id='passwordErrors'>
                {this.props.errors.password}
              </div>
            }
          </div>
          <button type='submit' disabled={!isEnabled} className='btn btn-md btn-default'>Login</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: getAccountErrors(state),
  };
}

UserLoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

UserLoginPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(UserLoginPage);
