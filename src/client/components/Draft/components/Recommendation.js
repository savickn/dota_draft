
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

  handleAddHero = (e) => {
    let team = e.nativeEvent.offsetX < 64 ? 'RAD' : 'DIRE';
    this.props.addHero(this.props.hero, team);
  }

  handleShowDetails = (e) => {

  }

  handleMouseOver = (e) => {
    if(e.nativeEvent.offsetX < 64) {
      this.setState({showRadiant: true, showDire: false});
    } else {
      this.setState({showRadiant: false, showDire: true});
    }
  }

  handleMouseOut = (e) => {
    this.setState({showRadiant: false, showDire: false});
  }
  
  render() {
    const { hero, } = this.props;
    let src = getImgSrcString(hero.localized_name);
    //console.log(src);
    let radiantBtn = <span id="overlay_text" className="addToRadiant" style={{position: 'relative', top: '-50px', zIndex: '3'}}>Radiant</span>
    let direBtn = <span id="overlay_text" className="addToRadiant" style={{position: 'relative', top: '-50px', zIndex: '3'}}>Dire</span>

    let overlay = null;
    if(this.state.showRadiant) overlay = radiantBtn;
    if(this.state.showDire) overlay = direBtn;

    return (
      <div className={`${styles.border} flex-column`}>
        <div style={{position: 'relative', zIndex: '1'}} onClick={(e) => this.handleAddHero(e)}>
          <img src={src} width="128" height="72" /*onMouseOver={(evt) => this.handleMouseOver(evt)}*/ onMouseOut={(evt) => this.handleMouseOut(evt)} 
            style={{position: 'relative', zIndex: '2'}} />
          {overlay}
        </div>
        <div>O: {hero.winrate}</div>
        <div className="data flex-row-even">
          <div className="vsDire">  
            <div>A: {hero.adjWrVsDire}</div>
            <div>N: {hero.advantage}</div>
          </div>
          <div className="withRadiant">  
            <div>A: {hero.adjWrWithRadiant}</div>
            <div>S: {hero.synergy}</div>
          </div>
        </div>
      </div>
    ); 
  }
}

HeroRecommendation.propTypes = {
  hero: PropTypes.object.isRequired, 
  addHero: PropTypes.func.isRequired, // 
  showDetails: PropTypes.func.isRequired, // 
}

export default HeroRecommendation;
