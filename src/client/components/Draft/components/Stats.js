import React from 'react';
import PropTypes from 'prop-types';

import styles from './Stats.scss';

class Stats extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = this.setMatchups(props.hero, props.enemies);
  }

  setMatchups(hero, enemies) {
    if(!hero || !enemies) return {};
    let matchups = {};
    let advantage = 0;
    let aggWr = 0;
    for(let e of enemies) {
      let matchup = hero.matchups.filter(m => m.enemy === e.localized_name)[0];
      matchups[e.localized_name] = Object.assign(e, matchup);
      aggWr += parseFloat(matchup.vsWinrate);
      advantage += parseFloat(-matchup.disadvantage);
    }

    let adjustedWinrate = (aggWr / enemies.length).toFixed(2);

    return {
      matchups,
      advantage: advantage.toFixed(2), 
      adjustedWinrate, 
    };
  }

  handleRemove = () => {
    this.props.remove(this.props.hero);
  }
  
  render() {
    const { matchups, advantage, adjustedWinrate } = this.state;
    const { hero, enemies, } = this.props;
    console.log('Stats hero -- ', hero);
    console.log('Stats enemies -- ', enemies);
    const src = hero['imgString'];

    console.log('Stats matchups -- ', this.state.matchups);

    return (
      <div className="flex-column">
        <div className="flex-row-viewport matchups">
          <div className="flex-column currentHero">
            <div>
              <img src={src} width="128" height="72" />
            </div>
            <div className="data">
              <div>O: {hero.winrate}</div>
              <div>A: {adjustedWinrate}</div>
              <div>N: {advantage}</div>
              <button className="minimal-btn" onClick={this.handleRemove}>Remove</button>
            </div>
          </div>
          {matchups && Object.keys(matchups).map((k) => {
            let m = matchups[k];
            return (
              <div className="flex-column">
                <div>
                  <img src={m.imgString} width="128" height="72" />
                </div>
                <div className="data">
                  <div>Exp: {m.vsWinrate}</div>
                  <div>Adv: {-m.disadvantage}</div>
                </div>
              </div>
            );
          })}

        </div>
        <div className="flex-row counters">

        </div>
        <div className="flex-row synergies">

        </div>
      </div>
    ); 
  }
}

Stats.propTypes = {
  hero: PropTypes.object.isRequired,  
  enemies: PropTypes.array.isRequired, 
  remove: PropTypes.func.isRequired, // callback to remove hero
}

export default Stats;
