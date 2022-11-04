


import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class HeroSearch extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {

    };


  }

  componentDidMount() {

  }


  render() {

    return (
      <div className="heroSelector">
        <div className="search">
          <input type='search' name='search' ref={this.searchRef} className='form-control' onChange={(e) => this.handleSearchInputChange()} />
        </div>
        <button onClick={() => this.searchHeroes()}>Search</button>
        <div className="results flex-row">
          {this.props.results.slice(0, 10).map((hero) => {
            let imgString = this.getImgSrcString(hero.localized_name);
            return <RecommendationElement src={imgString} hero={hero} addHero={this.handleAddHero} />
          })}
        </div>
      </div>
    )
  }
}

LaneMatchupPage.propTypes = {

};

const mapStateToProps = (state) => {
  return {

  };
};

export default connect(mapStateToProps)(LaneMatchupPage);




