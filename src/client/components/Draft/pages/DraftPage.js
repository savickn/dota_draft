
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

/* Reducers */

import { getRecommendations, getAnalytics, getDire, getRadiant, 
  getSearchResults, getPositions, } from '../DraftReducer';
import { getHeroes, } from '../../Hero/HeroReducer';

/* Actions */

import { 
  updateRecommendationsRequest, searchRecommendationsRequest, 
  analyticsRequest, saveDraftRequest, loadDraftRequest, 
} from '../DraftActions';
import { openModal, closeModal, } from '../../Utility/Modal/modalActions';


/*
** used to show list of Products
*/
class DraftPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      navState: 'RECOMMENDATIONS', 
      radiant: props.radiant,
      dire: props.dire,
      selectedHero: {}, // represents hero shown in modal
    };

    this.saveRef = React.createRef();
    this.loadRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedstate -- ', props, state);
    /*return {
      radiant: props.radiant,
      dire: props.dire, 
    }*/
  }

  componentDidMount() {
    this.getHeroRecommendations();
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('current', this.state);
    //console.log('prev', prevState);
    
    console.log('componentdidupdate -- ', this.state, this.props);
    
    if(this.state.radiant != prevState.radiant || this.state.dire != prevState.dire) {
      this.getHeroRecommendations();
    }
    // read about useEffects hooks 
    /*if(this.props.radiant != prevProps.radiant || this.props.dire != prevProps.dire) {
      this.setState({radiant: this.props.radiant, dire: this.props.dire});
    }*/
  }


  getHeroRecommendations() {
    let payload = {
      radiant: this.state.radiant, 
      dire: this.state.dire,
    };
    this.props.dispatch(updateRecommendationsRequest(payload));
  }

  handleAddHero = (hero, team) => {
    console.log('handleAddHero -- ', hero);

    let { radiant, dire } = this.state;
    
    if(team === 'RAD' && radiant.length < 5) {
      radiant.push(hero);
    } else if(team === 'DIRE' && dire.length < 5) {
      dire.push(hero);
    }

    this.setState({ radiant, dire }, () => {
      this.getHeroRecommendations();
    });
  }

  handleRemoveHero = (index, team) => {
    let { radiant, dire } = this.state;
    let target = team === 'RAD' ? radiant : dire;
    let hero = team === 'RAD' ? radiant[index] : dire[index];
    let out = [];

    if(!hero) return;

    // remove elem and compress array
    Array.from(Array(target.length).keys()).map((n) => {
      let current = target[n];
      if(current.localized_name !== hero.localized_name) {
        out.push(current);
      }
    });

    radiant = (team === 'RAD') ? out : radiant;
    dire = (team === 'DIRE') ? out : dire;

    this.setState({radiant, dire}, () => {
      this.getHeroRecommendations();
    });
  }

  // to show more stats
  setSelectedHero = (index, arrLabel) => {
    let arr; 
    switch(arrLabel) {
      case 'RAD':
        arr = this.state.radiant;
        break;
      case 'DIRE':
        arr = this.state.dire;
        break;
      case 'CARRY':
        arr = this.props.recommendations['Carry'];
        break;
      case 'MID':
        arr = this.props.recommendations['Mid'];
        break;
      case 'OFF':
        arr = this.props.recommendations['Offlane'];
        break;
      case 'ROAM':
        arr = this.props.recommendations['Support'];
        break;
      case 'SUP':
        arr = this.props.recommendations['Hard Support'];
        break;
      default:
        return;
    }

    let selectedHero = arr[index];
    selectedHero['imgString'] = getImgSrcString(selectedHero.localized_name);
    selectedHero['index'] = index;
    selectedHero['arrLabel'] = arrLabel;

    console.log('selected -- ', selectedHero);

    let enemies = arrLabel === 'DIRE' ? this.state.radiant : this.state.dire;
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
    this.setState({ radiant: [], dire: [] });
  }

  // working
  randomDire = () => {
    let pool = this.props.recommendations;
    let heroes = [];

    for(let k of Object.keys(this.props.recommendations)) {
      let l = pool[k].length;
      let f = false;
      
      // iterate until unique hero is added
      while(!f) {
        let n = Math.floor(Math.random() * Math.floor(l));
        let hero = pool[k][n];

        console.log('randomDire hero -- ', hero);
        console.log('randomDire heroes -- ', heroes);
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

    this.setState({dire: heroes});
  }


  /* laning functions */


  analyzeLanes = () => {

  }


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
    let { radiant, dire, showModal, navState, } = this.state;
    let { searchResults, } = this.props;
    console.log('draft page props --> ', this.props);
    //console.log('draft page state --> ', this.state);

    let { r_C, r_M, r_O, r_4, r_5, } = this.props.positions;
    let { d_C, d_M, d_O, d_4, d_5, } = this.props.positions;

    return (
      <div className='flex-column'>
        <HeroSearch search={this.handleSearch} />
        <div className="results flex-row">
          { searchResults.slice(0, 10).map((hero) => {
            return <RecommendationElement hero={hero} addHero={this.handleAddHero} />
          })}
        </div>
        <div className='draft flex-column'>
          <div className='radiant flex-column'>
            <div className='radiant-header'>RADIANT</div>
            <div className='radiant-heroes flex-row-viewport'>
              { Array.from(Array(5).keys()).map((n) => {
                let src = radiant[n] ? getImgSrcString(radiant[n].localized_name) : '//:0';
                let img = <img src={src} style={{backgroundColor: 'grey'}} 
                  width='256' height='144' 
                  onClick={(e) => this.setSelectedHero(n, 'RAD')}/>;
                let placeholder = <button style={{backgroundColor: 'grey', width: '256', height: '144'}} />
                return img;
                //return radiant[n] ? img : placeholder;
              })}
            </div>
          </div>
          
          <div className='dire flex-column'>
            <div className='dire-header'>DIRE</div>
            <div className='dire-heroes flex-row-viewport'>
              { Array.from(Array(5).keys()).map((n) => {
                  let src = dire[n] ? getImgSrcString(dire[n].localized_name) : '//:0';
                  let img = <img src={src} style={{backgroundColor: 'grey'}} 
                    width='256' height='144' 
                    onClick={(e) => this.setSelectedHero(n, 'DIRE')}
                    />;
                  let placeholder = <button style={{backgroundColor: 'grey', width: '256', height: '144'}} />
                  return img;
                  //return radiant[n] ? img : placeholder;
                })}
            </div>
          </div>
        </div>

        <div className='actions flex-horizontal-center'>
          <button onClick={() => this.resetDraft()}>Reset</button>
          <button onClick={() => this.randomDire()}>Random</button>
          <button onClick={() => this.openSavePrompt()}>Save</button>
          <button onClick={() => this.openLoadPrompt()}>Load</button>
        </div>

        <div className='navigation flex-horizontal-center'>
          <div className="recommendation-tab minimal-btn" onClick={() => this.handleNavChange('RECOMMENDATIONS')}>Recommendations</div>
          <div className="lane-tab minimal-btn" onClick={() => this.handleNavChange('LANING')}>Laning</div>
          <div className="analysis-tab minimal-btn" onClick={() => this.handleNavChange('TEAMCOMP')}>Team Composition</div>
        </div>

        <div className='nav-content'>
          { navState === 'RECOMMENDATIONS' && 
            <div className="recommendations flex-row-viewport">
              { this.props.recommendations && Object.keys(this.props.recommendations).map((k) => {
                let list = this.props.recommendations[k];
                return (
                  <div className={'flex-column ' + k}>
                    <div>{k}</div>
                    { list.slice(0, 10).map((hero) => {
                      return <RecommendationElement hero={hero} addHero={this.handleAddHero} />
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
                <LaneMatchup radiant={{r_C, r_5}} dire={{d_O, d_4}} lane="SAFE" />
              </div>
              <div className="mid">
                <div>MID</div>
                <LaneMatchup radiant={{r_M}} dire={{d_M}} lane="MID" />  
              </div>
              <div className="radiant-off">
                <div>OFFLANE</div>
                <LaneMatchup radiant={{r_O, r_4}} dire={{d_C, d_5}} lane="OFF" />
              </div>
            </div>
          }
          { navState === 'TEAMCOMP' && 
            <div className="analysis">
              
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