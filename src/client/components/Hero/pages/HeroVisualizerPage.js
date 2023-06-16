

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

import { searchHeroesRequest, updateHeroRequest, } from '../HeroActions';


import styles from './HeroVisualizerPage.scss';


const positions = [ '1', '2', '3', '4', '5'];
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

    // get 'currentFeature' and 'position' from localStorage
    let feature = localStorage.getItem('visualizer_feature');
    let position = localStorage.getItem('visualizer_position');
    console.log(feature, position);

    let obj = {};
    if(feature) obj['currentFeature'] = feature;
    obj['position'] = position;
    
    this.setState(obj);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps !== this.props) {
      this.buildFeatures();
    }
  }

  // send AJAX request to populate heroes
  searchHeroes = debounce(() => {
    this.props.dispatch(searchHeroesRequest(this.state.search, this.state.pagination));
  })

  // return 'true' if 'hero' satisfies 'position' or if 'position' is null
  isPosition(hero, position) {
    if(!position) return true;
    return hero.position[position - 1] === '1';
  }

  // sort heroes into ranks (1-5) based on currentFeature
  buildFeatures() {
    let { position, currentFeature, } = this.state;
    let heroes = {
      '1' : [], '2' : [], '3' : [], '4' : [], '5' : [], 'N/A': [],
    };

    if(!currentFeature) return;

    for(let h of this.props.heroes) {
      if(!this.isPosition(h, position)) continue;

      // check if hero 'h' has feature
      let feature = h.stats.concat(h.contributions).filter(e => e.feature === currentFeature);
      let val = feature.length > 0 ? feature[0].value : null;

      //console.log(val, ' - ', h);
      if(!val || !positions.includes(val)) {
        heroes['N/A'].push(h);
      } else {
        heroes[val].push(h);
      }
    }

    this.setState({ features: heroes, });
  }

  handleSelectFeature = (val) => {
    localStorage.setItem('visualizer_feature', val);
    this.setState({ currentFeature: val }, () => {
      this.buildFeatures();
    });
  }

  handleSelectPosition = (val) => {
    localStorage.setItem('visualizer_position', val);
    this.setState({ position: val }, () => {
      this.buildFeatures();
    });
  } 

  /* DRAG & DROP */

  handleDragStart = (e) => {
    e.dataTransfer.setData("id", e.target.id);
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    //console.log('dragOver');

    //e.target.classlist.add('unstyled-link');

  }
  
  handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('enter curr - ', e.currentTarget);
    if(e.target.classList.contains("tierbox")) {
      e.target.classList.add('hovered-link');
      console.log('enter tar -- ', e.target);
    }
    
    //console.log(e.currentTarget.classList);

    // add class if entering 'tierbox' div

    //console.log(e.currentTarget.classList);
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('exit curr - ', e.currentTarget);
    if(e.target.classList.contains("tierbox")) {
      e.target.classList.remove('hovered-link');
      console.log('exit tar -- ', e.target);
    }

    //console.log('dragLeave');
    //e.currentTarget.classList.remove('unstyled-link');
  }

  // 'e.currentTarget' always references 'tierbox' element
  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    //console.log(e.currentTarget.classList);
    //e.currentTarget.classList.remove('unstyled-link');
    //console.log(e.currentTarget.classList);
    

    // prevent drop outside of tierbox
    if(!e.currentTarget.classList.contains("tierbox")) {
      return;
    }

    // move element
    let id = e.dataTransfer.getData("id");
    let elem = document.getElementById(id);
    // causes error because React will sync automatically after props change
    //e.currentTarget.querySelector("div.heroes").appendChild(elem);

    // update hero via API
    let attr = this.state.currentFeature;
    let val = e.currentTarget.firstChild.getAttribute('val');
    let hero = this.props.heroes.filter(e => id === e.localized_name)[0];

    // prevent drop in 'N/A' container
    if(val && positions.includes(val)) {
      this.updateAttributeRanking(hero, attr, val); 
    }
  }

  // update hero attribute after drag&drop
  updateAttributeRanking = (hero, attr, val) => {
    let target = teamFeatures.includes(attr) ? 'TEAM' : 'HERO';
    let obj = {};
    
    if(target === 'TEAM') {
      let hasAttr = hero.contributions.filter(e => e.feature === attr).length > 0;
      if(hasAttr) {
        // update team contributions
        obj['contributions'] = hero.contributions.map(contribution => {
          if(contribution.feature === attr) {
            return { feature: attr, value: val };
          }
          return contribution;
        })
      } else {
        // add new value if not exists
        obj['contributions'] = hero.contributions;
        obj.contributions.push({ feature: attr, value: val })
      }
    } else {
      let hasAttr = hero.stats.filter(e => e.feature === attr).length > 0;
      if(hasAttr) {
        // update individual stats
        obj['stats'] = hero.stats.map(stat => {
          if(stat.feature === attr) {
            return { feature: attr, value: val };
          }
          return stat;
        });
      } else {
        // add new value if not exists
        obj['stats'] = hero.stats;
        obj.stats.push({ feature: attr, value: val })
      }
    }
    this.props.dispatch(updateHeroRequest(obj, hero._id));
  }

  
  render() {
    let { position, currentFeature, } = this.state;

    //console.log('visualizer state --> ', this.state);
    //console.log('visualizer props --> ', this.props);

    return (
      <React.Fragment>
        <div className='center-x'>
          <select onChange={e => this.handleSelectFeature(e.target.value)}>
            { stats.map((item, index) => {
              let bool = item === currentFeature;
              return <option key={index} value={item} selected={bool}>{item}</option>
            })}
          </select>
          <select onChange={e => this.handleSelectPosition(e.target.value)}>
            { positions.map((item, index) => {
              let bool = position === item;
              return <option key={index} value={item} selected={bool}>Position {item}</option>
            })}
            <option key={positions.length} value={''} selected={!position}>All Positions</option>
          </select>
        </div>

        { this.props.heroes.length > 0 && 
          <div className="indent-children features">
            { Object.keys(this.state.features).map((item, i) => {
              let heroes = this.state.features[item];
              return (
                <div className={`tierbox ${styles.tierbox}`} 
                  onDragOver={this.handleDragOver} 
                  onDragEnter={this.handleDragEnter}
                  onDragLeave={this.handleDragLeave}
                  onDrop={this.handleDrop}>
                  <div val={i+1} key={`feature-${i+1}`} className={`tier${i} ${styles.tier}`}>
                    <div className={`rank ${styles.rank}`}><span>{item}</span></div>
                    <div className={`heroes ${styles.heroes}`}>
                      { heroes.map((hero, j) => {
                        return (
                          <span id={hero.localized_name} key={`${i}-hero-${j}`} draggable="true" 
                            onDragStart={(e) => this.handleDragStart(e, hero)}>
                            <Link to={`heroes/${hero._id}`} draggable="false">
                              {hero.localized_name}
                            </Link>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <br />
                </div>
              );
            })}
            {

            }
          </div>
        } 
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

