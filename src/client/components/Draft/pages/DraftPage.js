
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import { getImgSrcString, } from '../../../util/dotaHelpers';

/* Components */

import HeroElement from '../../Hero/components/HeroElement';
import RecommendationElement from '../components/Recommendation';
import HeroSearch from '../../Hero/components/HeroSearch';
import Modal from '../../Utility/Modal/modal';
import Stats from '../components/Stats';
import LaneMatchup from '../../Lane/LaneMatchupPage';
import Composition from '../components/Composition';

/* Reducers */

import { getRecommendations, getAnalytics, getDire, getRadiant, 
  getSearchResults, getPositions, } from '../DraftReducer';
import { getHeroes, } from '../../Hero/HeroReducer';

/* Actions */

import { 
  updateRecommendationsRequest, searchRecommendationsRequest, 
  analyticsRequest, saveDraftRequest, loadDraftRequest, 
  updateDraftRequest, updateLanesSuccess, 
} from '../DraftActions';
import { openModal, closeModal, } from '../../Utility/Modal/modalActions';

import styles from './DraftPage.scss';


let defaultPositions = {
  r_C: [], r_M: [], r_O: [], r_4: [], r_5: [],
  d_C: [], d_M: [], d_O: [], d_4: [], d_5: [],
};

/*
** used to show list of Products
*/
class DraftPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      navState: 'RECOMMENDATIONS', 
      selectedHero: {}, // represents hero shown in modal
      hoveredElem: null, // represents the element over which an overlay should be drawn
    };

    this.saveRef = React.createRef();
    this.loadRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {}

  componentDidMount() {
    this.props.dispatch(updateRecommendationsRequest({
      radiant: [],
      dire: [], 
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('current', this.state);
    //console.log('prev', prevState);
  }


  // team is ['RAD', 'DIRE']
  // hero is hero object
  handleAddHero = (hero, team) => {
    //console.log('handleAddHero -- ', hero);

    let { radiant, dire } = this.props;
    
    if(team === 'RAD' && radiant.length < 5) {
      radiant.push(hero);
    } else if(team === 'DIRE' && dire.length < 5) {
      dire.push(hero);
    } else {
      // add error message
    }

    this.props.dispatch(updateRecommendationsRequest({ radiant, dire }));
  }

  handleRemoveHero = (hero) => {
    if(!hero) return;
    let { radiant, dire } = this.props;
    console.log(radiant);
    let target;
    let team;
    let out = [];
    if(radiant.filter(r => r.localized_name === hero.localized_name).length > 0) {
      target = radiant;
      team = 'RAD';
    } else if(dire.filter(d => d.localized_name === hero.localized_name).length > 0) {
      target = dire;
      team = 'DIRE';
    } else {
      return;
    }

    // remove elem and compress array
    Array.from(Array(target.length).keys()).map((n) => {
      let current = target[n];
      if(current.localized_name !== hero.localized_name) {
        out.push(current);
      }
    });

    radiant = (team === 'RAD') ? out : radiant;
    dire = (team === 'DIRE') ? out : dire;

    this.props.dispatch(updateRecommendationsRequest({radiant, dire}));
    this.props.dispatch(closeModal("stats"));
  }

  // to show more stats
  setSelectedHero = (hero, arrLabel) => {
    console.log(arrLabel, hero);
    let arr; 
    switch(arrLabel) {
      case 'RAD':
        arr = this.props.radiant;
        break;
      case 'DIRE':
        arr = this.props.dire;
        break;
      case 'Carry':
        arr = this.props.recommendations['Carry'];
        break;
      case 'Mid':
        arr = this.props.recommendations['Mid'];
        break;
      case 'Offlane':
        arr = this.props.recommendations['Offlane'];
        break;
      case 'Support':
        arr = this.props.recommendations['Support'];
        break;
      case 'Hard Support':
        arr = this.props.recommendations['Hard Support'];
        break;
      default:
        return;
    }

    let selectedHero = hero; 
    selectedHero['imgString'] = getImgSrcString(selectedHero.localized_name);
    selectedHero['arrLabel'] = arrLabel;

    console.log('selected -- ', selectedHero);

    let enemies = arrLabel === 'DIRE' ? this.props.radiant : this.props.dire;
    enemies = enemies.map(e => {
      e.imgString = getImgSrcString(e.localized_name);
      return e;
    });

    console.log('enemies -- ', enemies);

    this.setState({selectedHero, enemies}, () => {
      this.props.dispatch(openModal("stats"));
    }); 
  }

  resetDraft = () => {
    this.props.dispatch(updateRecommendationsRequest({radiant: [], dire: []}));
    //this.setState({ radiant: [], dire: [] });
    this.props.dispatch(updateLanesSuccess(defaultPositions));
  }

  // working
  randomTeam = (team) => {
    let pool = this.props.recommendations;
    let heroes = [];

    for(let k of Object.keys(this.props.recommendations)) {
      let l = pool[k].length;
      let f = false;
      
      // iterate until unique hero is added
      while(!f) {
        let n = Math.floor(Math.random() * Math.floor(l));
        let hero = pool[k][n];

        //console.log('randomDire hero -- ', hero); 
        //console.log('randomDire heroes -- ', heroes); 
        
        // check if hero already exists in array
        let exists = false;
        for(let h of heroes) {
          if(h.id === hero.id) {
            exists = true;
          } 
        } 

        if(!exists) {
          heroes.push(hero);
          f = true;
        } 
      }
    } 

    let radiant = team === 'RAD' ? heroes : this.props.radiant;
    let dire = team === 'DIRE' ? heroes : this.props.dire;

    this.props.dispatch(updateRecommendationsRequest({
      radiant, 
      dire, 
    }));
    //this.setState({dire: heroes});
  }


  /* laning functions */

  analyzeLanes = () => {

  }

  updateLane = (position, hero) => {
    console.log(position, ' -- ', hero);
    let positions = {};
    console.log(this.props.positions);
    for(let k of Object.keys(this.props.positions)) {
      console.log(k);
      if(k === position) {
        positions[k] = [hero]
      } else {
        positions[k] = this.props.positions[k].filter(h => h.localized_name !== hero.localized_name);
      }
    }
    console.log(positions);
    this.props.dispatch(updateLanesSuccess(positions));
  }


  /* UI features */

  
  showOverlay = (evt) => {
    console.log(evt);
    evt.stopPropagation();
    this.setState({ hoveredElem: evt.target.id })
  }

  hideOverlay = () => {
    this.setState({ hoveredElem: null });
  }




  /* misc */


  handleSearch = (text) => {
    this.props.dispatch(searchRecommendationsRequest(text));
    //this.props.dispatch(searchHeroesRequest({ text }));
  }

  handleNavChange = (val) => {
    this.setState({navState: val});
  }

  openSavePrompt = () => {
    this.props.dispatch(openModal("saveDraft"));
  }

  saveDraft = () => {
    let text = this.saveRef.current.value || '';
    this.props.dispatch(saveDraftRequest(text));
  }

  openLoadPrompt = () => {
    this.props.dispatch(openModal("loadDraft"));
  }

  loadDraft = () => {
    let text = this.loadRef.current.value || '';
    this.props.dispatch(loadDraftRequest(text));
  }


  // onChange --> dispatch GET_ANALYTICS and GET_HERO_RECOMMENDATIONS

  render() {
    let { showModal, navState, } = this.state;
    let { searchResults, radiant, dire } = this.props;
    //console.log('draft page props --> ', this.props);
    //console.log('draft page state --> ', this.state);

    let { r_C, r_M, r_O, r_4, r_5, } = this.props.positions;
    let { d_C, d_M, d_O, d_4, d_5, } = this.props.positions;

    return (
      <div className='flex-column'>
        <HeroSearch search={this.handleSearch} />
        <div className="results flex-row">
          { searchResults.slice(0, 10).map((hero) => {
            return <RecommendationElement hero={hero} 
              addHero={this.handleAddHero} showDetails={this.setSelectedHero} />
          })}
        </div>
        <div className='draft flex-column'>
          <div className='radiant flex-column'>
            <div className='radiant-header'>RADIANT</div>
            <div className='radiant-heroes flex-row-viewport'>
              { Array.from(Array(5).keys()).map((n) => {
                console.log('heroId -- ', radiant[n])
                let src = radiant[n] ? getImgSrcString(radiant[n].localized_name) : '//:0';
                let elem = radiant[n] ? (
                  <span className={styles.overlayContainer}>
                    <img src={src} 
                      className={styles.selectedHeroElem}
                      onClick={(e) => this.setSelectedHero(radiant[n], 'RAD')}
                      onMouseOver={(e) => this.showOverlay(e) }
                      onMouseOut={(e) => this.hideOverlay()}/>
                    <span className={styles.overlay}>
                      <button className={styles.overlayBtn}>Info</button>
                      <button className={styles.overlayBtn}>Remove</button>
                    </span>
                  </span>
                ) : <span className={styles.selectedHeroElem}></span>

                return elem;
              })}
              { this.state.hoveredElem &&
                <div></div>
              }
            </div>
          </div>
          
          <div className='dire flex-column'>
            <div className='dire-header'>DIRE</div>
            <div className='dire-heroes flex-row-viewport'>
              { Array.from(Array(5).keys()).map((n) => {
                  let src = dire[n] ? getImgSrcString(dire[n].localized_name) : '//:0';
                  return <img src={src} 
                    style={{backgroundColor: 'grey'}} 
                    width='256' height='144' 
                    onClick={(e) => this.setSelectedHero(dire[n], 'DIRE')}/>;
                })}
            </div>
          </div>
        </div>

        <div className='actions flex-horizontal-center'>
          <button className="minimal-btn" onClick={() => this.resetDraft()}>Reset</button>
          <button className="minimal-btn" onClick={() => this.randomTeam("DIRE")}>Random Dire</button>
          <button className="minimal-btn" onClick={() => this.randomTeam("RAD")}>Random Radiant</button>
          <button className="minimal-btn" onClick={() => this.openSavePrompt()}>Save</button>
          <button className="minimal-btn" onClick={() => this.openLoadPrompt()}>Load</button>
        </div>

        <div className='navigation flex-horizontal-center'>
          <div className="recommendation-tab minimal-btn" onClick={() => this.handleNavChange('RECOMMENDATIONS')}>Recommendations</div>
          <div className="lane-tab minimal-btn" onClick={() => this.handleNavChange('LANING')}>Laning</div>
          <div className="analysis-tab minimal-btn" onClick={() => this.handleNavChange('TEAMCOMP')}>Team Composition</div>
        </div>

        <div className={`${styles['nav-content']}`}>
          { navState === 'RECOMMENDATIONS' && 
            <div className="recommendations flex-row-viewport">
              { this.props.recommendations && Object.keys(this.props.recommendations).map((k) => {
                let list = this.props.recommendations[k];
                return (
                  <div className={'flex-column ' + k}>
                    <div>{k}</div>
                    { list.slice(0, 10).map((hero) => {
                      return <RecommendationElement hero={hero} collection={k} 
                        addHero={this.handleAddHero} showDetails={this.setSelectedHero} />
                    })}
                  </div>
                );
              })}
            </div>
          } 
          { navState === 'LANING' &&
            <div className="laning flex-row-viewport">
              <div className="radiant-safe">
                <div>SAFELANE</div>
                <LaneMatchup radiant={{r_C, r_5}} dire={{d_O, d_4}} 
                  lane="SAFE" updatePosition={this.updateLane} />
              </div>
              <div className="mid">
                <div>MID</div>
                <LaneMatchup radiant={{r_M}} dire={{d_M}} 
                  lane="MID" updatePosition={this.updateLane} />  
              </div>
              <div className="radiant-off">
                <div>OFFLANE</div>
                <LaneMatchup radiant={{r_O, r_4}} dire={{d_C, d_5}} 
                  lane="OFF" updatePosition={this.updateLane} />
              </div>
            </div>
          }
          { navState === 'TEAMCOMP' && 
            <div className="analysis">
              <Composition radiant={radiant} dire={dire} />
            </div>
          }
        </div>

        <Modal identifier="saveDraft">
          <input  type='text' ref={this.saveRef} className='form-control' />
          <button onClick={() => this.saveDraft()}>Save</button>
        </Modal>

        <Modal identifier="loadDraft">
          <input  type='text' ref={this.loadRef} className='form-control' />
          <button onClick={() => this.loadDraft()}>Load</button>
        </Modal>

        <Modal identifier="stats"> 
          <Stats hero={this.state.selectedHero} enemies={this.state.enemies} remove={this.handleRemoveHero} />
        </Modal>
      </div>
    )
  }



}

DraftPage.propTypes = {
  radiant: PropTypes.array.isRequired, // my team
  dire: PropTypes.array.isRequired, // enemy team
  analytics: PropTypes.array.isRequired, // recommended strategy 
  recommendations: PropTypes.array.isRequired, // recommended heroes
  searchResults: PropTypes.array.isRequired, // search results
};

const mapStateToProps = (state) => {
  return {
    recommendations: getRecommendations(state),
    radiant: getRadiant(state),
    dire: getDire(state),
    positions: getPositions(state),
    analytics: getAnalytics(state),
    searchResults: getSearchResults(state),
    //searchResults: getHeroes(state),
  };
};

export default connect(mapStateToProps)(DraftPage);






/* 
<div className="radiant-off">
                <div>SAFELANE</div>
                <div className="rad">
                  {this.buildImgArray(2, '128', '72', radiant, null)}
                </div>
                <div> VS. </div>
                <div className="dire">
                  {this.buildImgArray(2, '128', '72', dire, null)}
                </div>
              </div>
              */