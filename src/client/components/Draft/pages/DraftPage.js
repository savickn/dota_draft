
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';


/* Components */

import HeroElement from '../../Hero/components/HeroElement';
import RecommendationElement from '../components/Recommendation';
import Modal from '../../Utility/Modal/modal';
import Stats from '../components/Stats';

/* Reducers */

import { getHeroRecommendations, getAnalytics, } from '../DraftReducer';
import { getHeroes, } from '../../Hero/HeroReducer';

/* Actions */

import { heroRecommendationRequest, analyticsRequest, } from '../DraftActions';
import { searchHeroesRequest, } from '../../Hero/HeroActions';
import { openModal, closeModal, } from '../../Utility/Modal/modalActions';


/*
** used to show list of Products
*/
class DraftPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      radiant: [],
      dire: [],
      selectedHero: {}, // represents hero shown in modal
    };

    this.searchRef = React.createRef();
  }




  componentDidMount() {
    this.getHeroRecommendations();
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('current', this.state);
    //console.log('prev', prevState);
    if(this.state.radiant != prevState.radiant || this.state.dire != prevState.dire) {
      this.getHeroRecommendations();
    }
  }


  getHeroRecommendations() {
    let payload = {
      radiant: this.state.radiant, 
      dire: this.state.dire,
    };
    this.props.dispatch(heroRecommendationRequest(payload));
  }

  getImgSrcString(name) {
    let nameArr = name.split(' ');
    let imgString = '/assets/';
    for(let substr of nameArr) {
      imgString += `${substr}_`;
    }
    imgString += 'icon.webp';
    return imgString;
  }

  handleAddHero = (e, hero) => {
    let { radiant, dire } = this.state;
    if(e.nativeEvent.offsetX < 64) {
      if(radiant.length < 5) radiant.push(hero);
    } else {
      if(dire.length < 5) dire.push(hero);
    }
    this.setState({radiant, dire}, () => {
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
    })

    radiant = team === 'RAD' ? out : radiant;
    dire = team === 'DIRE' ? out : dire;

    this.setState({radiant, dire}, () => {
      this.getHeroRecommendations();
    })
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
    selectedHero['imgString'] = this.getImgSrcString(selectedHero.localized_name);
    selectedHero['index'] = index;
    selectedHero['arrLabel'] = arrLabel;

    console.log('selected -- ', selectedHero);

    let enemies = arrLabel === 'DIRE' ? this.state.radiant : this.state.dire;
    enemies = enemies.map(e => {
      e.imgString = this.getImgSrcString(e.localized_name);
      return e;
    });

    console.log('enemies -- ', enemies);

    this.setState({selectedHero, enemies}, () => {
      this.props.dispatch(openModal());
    });
  }

  handleSearchInputChange = debounce(() => {
    this.searchHeroes();
  }, 500)

  searchHeroes = () => {
    let text = this.searchRef.current.value || '';
    this.props.dispatch(searchHeroesRequest({ text }));
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

  closeModal = () => {
    // should prob save form data before closing
    this.props.dispatch(closeModal());
  }

  // onChange --> dispatch GET_ANALYTICS and GET_HERO_RECOMMENDATIONS

  render() {
    let { radiant, dire, showModal, } = this.state;
    //console.log('draft page props --> ', this.props);
    //console.log('draft page state --> ', this.state);

    return (
      <div className='flex-column'>
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
        <div className='draft flex-column'>
          <div className='radiant flex-column'>
            <div className='radiant-header'>RADIANT</div>
            <div className='radiant-heroes flex-row-viewport'>
              { Array.from(Array(5).keys()).map((n) => {
                let src = radiant[n] ? this.getImgSrcString(radiant[n].localized_name) : '//:0';
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
                  let src = dire[n] ? this.getImgSrcString(dire[n].localized_name) : '//:0';
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

        <button onClick={() => this.resetDraft()}>Reset</button>

        <button onClick={() => this.randomDire()}>Random</button>

        <Modal close={this.closeModal}> 
          <Stats hero={this.state.selectedHero} enemies={this.state.enemies} remove={this.handleRemoveHero} />
        </Modal>

        <div className="analysis">


        </div>

        <div className="recommendations flex-row-viewport">
          { this.props.recommendations && Object.keys(this.props.recommendations).map((k) => {
            //console.log(k, this.props.recommendations[k]);
            let v = this.props.recommendations[k];
            v.sort((a, b) => {
              if(a.score < b.score) {
                return 1;
              } else if(a.score > b.score) {
                return -1;
              } else {
                return 0;
              }
            })
            return (
              <div className={'flex-column ' + k}>
                <div>{k}</div>
                { v.slice(0, 10).map((hero) => {
                  let imgString = this.getImgSrcString(hero.localized_name);
                  //return <img src={imgString} width="128" height="72" />;
                  return <RecommendationElement src={imgString} hero={hero} addHero={this.handleAddHero} />
                })}
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

DraftPage.propTypes = {
  radiant: PropTypes.array.isRequired, // my team
  dire: PropTypes.array.isRequired, // enemy team
  analytics: PropTypes.array.isRequired, // recommended strategy 
  recommendations: PropTypes.array.isRequired, // recommended heroes
  results: PropTypes.array.isRequired, // search results
};

const mapStateToProps = (state) => {
  return {
    recommendations: getHeroRecommendations(state),
    analytics: getAnalytics(state),
    results: getHeroes(state),
  };
};

export default connect(mapStateToProps)(DraftPage);