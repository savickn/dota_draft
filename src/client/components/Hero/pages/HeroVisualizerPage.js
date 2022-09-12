

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import { Link } from 'react-router-dom';

import { teamFeatures, scalingFeatures, } from '../constants/attributes';


/* Components */

import HeroElement from '../components/HeroElement';

/* Reducers */

import { getHeroes, } from '../HeroReducer';

/* Actions */

import { searchHeroesRequest, } from '../HeroActions';


import styles from './HeroVisualizerPage.scss';


const positions = [ '1', '2', '3', '4', '5', ];
const stats = teamFeatures.concat(scalingFeatures);

class HeroVisualizerPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: {}, // for custom products search
      pagination: {},
      position: null,
      currentFeature: null,
      features: [],      
    };
  }

  componentDidMount() {
    this.searchHeroes(); // get products from DB
  }

  // send AJAX request to populate products
  searchHeroes = debounce(() => {
    this.props.dispatch(searchHeroesRequest(this.state.search, this.state.pagination));
  })

  isPosition(hero, position) {
    if(!position) return true;
    return hero.position[position - 1] === '1';
  }

  // create feature map
  buildFeatures() {
    let heroes = {
      '1' : [],
      '2' : [],
      '3' : [],
      '4' : [],
      '5' : [], 
    };

    let { position, currentFeature, } = this.state;

    if(!currentFeature) return;

    for(let h of this.props.heroes) {
      if(!this.isPosition(h, position)) continue;

      let f = h.stats.concat(h.contributions).filter(e => e.feature === currentFeature);
      let v = null;

      if (f.length > 0) {
        v = f[0].value;
      };

      heroes[v].push(h);
    }

    this.setState({ features: heroes, });
  }

  handleSelectFeature = (val) => {
    //localStorage.setItem();
    this.setState({ currentFeature: val }, () => {
      this.buildFeatures();
    });
  }

  handleSelectPosition = (val) => {
    //localStorage.setItem();
    this.setState({ position: val }, () => {
      this.buildFeatures();
    });
  } 

  
  render() {
    console.log('visualizer state --> ', this.state);
    console.log('visualizer props --> ', this.props);

    return (
      <React.Fragment>
        <div className='center-x'>
          <select onChange={e => this.handleSelectFeature(e.target.value)}>
            { stats.map((item, index) => {
              return <option key={index} value={item}>{item}</option>
            })}
          </select>
          <select onChange={e => this.handleSelectPosition(e.target.value)}>
            { positions.map((item, index) => {
              return <option key={index} value={item}>Position {item}</option>
            })}
          </select>
        </div>

        <div className="indent-children features">
          { Object.keys(this.state.features).map((item, i) => {
            let heroes = this.state.features[item];
            return (
              <div className={styles.tierbox}>
                <div key={`feature-${i}`} className={styles.tier}>
                  <div className={styles.rank}><span>{item}</span></div>
                  <div className={styles.heroes}>
                    { heroes.map((hero, j) => {
                      return (
                        <span key={`${i}-hero-${j}`}>
                          <Link to={`heroes/${hero._id}`}>{hero.localized_name}</Link>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <br />
              </div>
            );
          })}
        </div>
      </React.Fragment>
    )
  }
}

HeroVisualizerPage.propTypes = {
  heroes: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired, 
}

const mapStateToProps = (state) => {
  return {
    heroes: getHeroes(state), 
  };
}

export default connect(mapStateToProps)(HeroVisualizerPage);


/*
      if(v) {
        switch(v) {
          case '1':
            v1.push(h);
            break;
          case '2':
            v2.push(h);
            break;
          case '3':
            v3.push(h);
            break;
          case '4':
            v4.push(h);
            break;
          case '5':
            v5.push(h);
            break;
        }
      }
      */

/*

<div className="indent-children features">
          { this.state.features.map((item, i) => {
            console.log(item);
            return (
              <div className={styles.tierbox}>
                <div key={`feature-${i}`} className={styles.tier}>
                  <div className={styles.rank}><span>{item.value}</span></div>
                  <div className={styles.heroes}>
                    { item.heroes.map((hero, j) => {
                      return (
                        <span key={`${i}-hero-${j}`}>
                          <Link to={`heroes/${hero._id}`}>{hero.localized_name}</Link>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <br />
              </div>
            );
          })}
        </div>

        */

