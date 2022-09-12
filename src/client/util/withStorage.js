import React from 'react';

const withStorage = (WrappedComponent) => {
  return class extends React.Component {
    state = {
      localStorageAvailable: false, 
    };
  
    componentDidMount() {
       this.checkLocalStorageExists();
    }
  
    checkLocalStorageExists() {
      const testKey = 'test';

      try {
          localStorage.setItem(testKey, testKey);
          localStorage.removeItem(testKey);
          this.setState({ localStorageAvailable: true });
      } catch(e) {
          this.setState({ localStorageAvailable: false });
      } 
    }
  
    load = (key) => {
      if (this.state.localStorageAvailable) {
        return localStorage.getItem(key); 
      }
      
      return null;
    }
    
    save = (key, data) => {
      if (this.state.localStorageAvailable) {
        localStorage.setItem(key, data);
      }
    }
    
    remove = (key) => {
      if (this.state.localStorageAvailable) {
        localStorage.removeItem(key);
      }
    }
    
    render() {
      return (
        <WrappedComponent
          load={this.load}
          save={this.save}
          remove={this.remove}
          {...this.props}
        />
      );
    }
  }
}

export default withStorage;



/*
import React from 'react';
import withStorage from 'components/withStorage';

class ComponentNeedingStorage extends React.Component {
  state = {
    username: '',
    favoriteMovie: '',
  }

  componentDidMount() {
    const username = this.props.load('username');
    const favoriteMovie = this.props.load('favoriteMovie');
    
    if (!username || !favoriteMovie) {
      // This will come from the parent component
      // and would be passed when we spread props {...this.props}
      this.props.reallyLongApiCall()
        .then((user) => {
          this.props.save('username', user.username) || '';
          this.props.save('favoriteMovie', user.favoriteMovie) || '';
          this.setState({
            username: user.username,
            favoriteMovie: user.favoriteMovie,
          });
        }); 
    } else {
      this.setState({ username, favoriteMovie })
    }
  }

  render() {
    const { username, favoriteMovie } = this.state;
    
    if (!username || !favoriteMovie) {
      return <div>Loading...</div>; 
    }
    
    return (
      <div>
        My username is {username}, and I love to watch {favoriteMovie}.
      </div>
    )
  }
}

const WrappedComponent = withStorage(ComponentNeedingStorage);

export default WrappedComponent;

*/