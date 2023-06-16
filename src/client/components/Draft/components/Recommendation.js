
import React from 'react';
import PropTypes from 'prop-types';

import styles from './Recommendation.scss';

import { getImgSrcString, } from '../../../util/dotaHelpers';

class HeroRecommendation extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showRadiant: false,
      showDire: false, 
    };
  }

  handleAddHero = (team) => {
    this.props.addHero(this.props.hero, team);
  }  

  // open info modal
  handleShowDetails = (e) => {
    this.props.showDetails(this.props.hero, this.props.collection);
  }
  
  render() {
    const { hero, } = this.props;
    let src = getImgSrcString(hero.localized_name);

    let hasDire = hero.advantage;
    let hasRadiant = hero.synergy;

    return (
      <div className={`${styles.border} flex-column`}>
        <div className="flex-row-even">
          <img src={src} width="128" height="72" onClick={this.handleShowDetails} />
        </div>
        <div className="flex-row-even">Win%: {hero.winrate}</div>
        { hasDire ? <div className="flex-row-even">Win% vs Dire: {hero.adjWrVsDire}</div> : ''}
        { hasDire ? <div className="flex-row-even">Advantage: {hero.advantage}%</div> : ''}
        { hasRadiant ? <div className="flex-row-even">Win% w\ Radiant: {hero.adjWrWithRadiant}</div> : ''}
        { hasRadiant ? <div className="flex-row-even">Synergy: {hero.synergy}</div> : ''}
        <div className="flex-row-even">
          <button className="minimal-btn" onClick={() => this.handleAddHero("RAD")}>Radiant</button>
          <button className="minimal-btn" onClick={() => this.handleAddHero("DIRE")}>Dire</button>
        </div>
      </div>
    ); 
  }
}

HeroRecommendation.propTypes = {
  hero: PropTypes.object.isRequired, 
  collection: PropTypes.string.isRequired, // collection containing 'hero' 
  addHero: PropTypes.func.isRequired, // 
  showDetails: PropTypes.func.isRequired, // 
}

export default HeroRecommendation;


/*

handleAddHero = (e) => {
  let team = e.nativeEvent.offsetX < 64 ? 'RAD' : 'DIRE';
  this.props.addHero(this.props.hero, team);
}

handleMouseOver = (e) => {
  if(e.nativeEvent.offsetX < 64) {
    this.setState({showRadiant: true, showDire: false});
  } else {
    this.setState({showRadiant: false, showDire: true});
  }
}

*/

/*
<div className="data flex-row-even">
          <div className="vsDire">  
            <div>Win% vs Dire: {hero.adjWrVsDire}</div>
            <div>Advantage: {hero.advantage}</div>
          </div>
          <div className="withRadiant">  
            <div>Win% with Radiant: {hero.adjWrWithRadiant}</div>
            <div>Synergy: {hero.synergy}</div>
          </div>
        </div>
*/
