
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getHero } from '../HeroReducer';
import { fetchHeroRequest } from '../HeroActions';
import { getHeroById, getHeroItems } from '../../OpenDota/OpenDotaReducer';
import { heroItemsRequest } from '../../OpenDota/OpenDotaActions';

import styles from './HeroPage.scss';

import noPic from '../../../assets/no_image.png';
import HeroForm from '../components/HeroForm';

// represents a router endpoint providing a detailed description of a single Product
class HeroPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  // make API calls
  componentDidMount() {
    this.props.dispatch(fetchHeroRequest(this.props.match.params.pid));
  }

  requestItems = () => {
    console.log(this.props.hero);
    if(this.props.hero) {
      this.props.dispatch(heroItemsRequest(this.props.hero.id));
    }
  }
  
  render() {
    const { hero, data, items } = this.props;
    console.log('hero page props --> ', this.props);

    return (
      <React.Fragment>
        <div className={styles.infoContainer}>
          <div className={styles.imageSidebar}>
            <img src={noPic} width="350" height="350" />
          </div>
        </div>
        <HeroForm dispatch={this.props.dispatch} hero={hero} />
        <button onClick={() => this.requestItems()}>Request Items</button>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch, 
  }; 
}

const mapStateToProps = (state, props) => {
  let hero = getHero(state, props.match.params.pid);
  let heroId = hero ? hero.id : null;

  return {
    hero: hero,
    data: getHeroById(state, heroId), 
    items: getHeroItems(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeroPage);
