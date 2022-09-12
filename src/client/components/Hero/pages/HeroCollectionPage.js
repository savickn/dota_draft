
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';


/* Components */

import HeroElement from '../components/HeroElement';
import HeroForm from '../components/HeroForm';

/* Reducers */

import { getHeroes, getErrors, getStatus } from '../HeroReducer';

/* Actions */

import { searchHeroesRequest } from '../HeroActions';


import styles from './HeroCollectionPage.scss';

/* show list of heroes */
class HeroCollectionPage extends React.Component {

  constructor(props) {
    super(props);

    let selectedPosition = localStorage.getItem('HeroCollectionPosition') || 'All';

    this.state = {
      search: {}, // for custom products search
      pagination: {},
      selectedPosition,
    };
  }

  componentDidMount() {
    this.searchHeroes(); // get products from DB
  }

  // send AJAX request to populate products
  searchHeroes = debounce(() => {
    this.props.dispatch(searchHeroesRequest(this.state.search, this.state.pagination));
  })

  handleSelectPosition = (val) => {
    localStorage.setItem('HeroCollectionPosition', val);
    this.setState({selectedPosition: val});
  }


                                  /* UI METHODS */
  
  render() {
    console.log(this.props.heroes);

    let { selectedPosition } = this.state;

    const heroes = selectedPosition === 'All' ? 
      this.props.heroes :
      this.props.heroes.filter(hero => hero.position[Number(selectedPosition) - 1] === '1');

    return (
      <React.Fragment>
        <div className={styles.positionHeader}>
          <div className={styles.tab} onClick={(evt) => this.handleSelectPosition('All')}>All</div>
          <div className={styles.tab} onClick={(evt) => this.handleSelectPosition('1')}>1</div>
          <div className={styles.tab} onClick={(evt) => this.handleSelectPosition('2')}>2</div>
          <div className={styles.tab} onClick={(evt) => this.handleSelectPosition('3')}>3</div>
          <div className={styles.tab} onClick={(evt) => this.handleSelectPosition('4')}>4</div>
          <div className={styles.tab} onClick={(evt) => this.handleSelectPosition('5')}>5</div>
        </div>
        <div className='flex-grid'>
          {heroes.map((hero) => {
            return <HeroElement hero={hero} key={hero.id} />
          })}
        </div>
        <br />
        <HeroForm dispatch={this.props.dispatch} />
      </React.Fragment>
    )
  }
}

HeroCollectionPage.propTypes = {
  /*products: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  })).isRequired, */
  dispatch: PropTypes.func.isRequired, 
}

const mapStateToProps = (state) => {
  return {
    heroes: getHeroes(state), 
  };
}

export default connect(mapStateToProps)(HeroCollectionPage);


