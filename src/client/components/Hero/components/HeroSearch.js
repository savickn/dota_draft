
import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

class HeroSearch extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {};
    this.searchRef = React.createRef();
  }

  handleSearchInputChange = debounce(() => {
    this.searchHeroes();
  }, 500)

  searchHeroes = () => {
    let text = this.searchRef.current.value || '';
    this.props.search(text);
  }

  render() {
    return (
      <div className="heroSelector">
        <div className="search">
          <input type='search' name='search' ref={this.searchRef} className='form-control' onChange={(e) => this.handleSearchInputChange()} />
        </div>
        <span class="icon">
          <i class="fas fa-user" onClick={() => this.searchHeroes()}></i>
        </span>
      </div>
    )
  }
}

HeroSearch.propTypes = {
  search: PropTypes.func.isRequired, 
}

export default HeroSearch;


//         <button onClick={() => this.searchHeroes()}>Search</button>