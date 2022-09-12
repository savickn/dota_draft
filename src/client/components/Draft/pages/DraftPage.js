
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';


/* Components */

import HeroElement from '../../Hero/components/HeroElement';
import RecommendationElement from '../components/Recommendation';

/* Reducers */

import { getHeroRecommendations, getAnalytics, } from '../DraftReducer';
import { getHeroes, } from '../../Hero/HeroReducer';

/* Actions */

import { heroRecommendationRequest, analyticsRequest, } from '../DraftActions';
import { searchHeroesRequest, } from '../../Hero/HeroActions';


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
    e.nativeEvent.offsetX < 64 ? radiant.push(hero) : dire.push(hero);
    this.setState({radiant, dire}, () => {
      this.getHeroRecommendations();
    });
  }

  searchHeroes = () => {
    let text = this.searchRef.current.value || '';
    console.log(text);
    this.props.dispatch(searchHeroesRequest({ text }));
  }

  resetDraft = () => {
    this.setState({ radiant: [], dire: [] });
  }


  // onChange --> dispatch GET_ANALYTICS and GET_HERO_RECOMMENDATIONS

  render() {
    let { radiant, dire, } = this.state;
    console.log('draft page props --> ', this.props);


    return (
      <div className='flex-column'>
        <div className='draft flex-column'>
          <div className='radiant flex-column'>
            <div className='radiant-header'>RADIANT</div>
            <div className='radiant-heroes flex-row-viewport'>
              { Array.from(Array(5).keys()).map((n) => {
                let src = radiant[n] ? this.getImgSrcString(radiant[n].localized_name) : '//:0';
                let img = <img src={src} style={{backgroundColor: 'grey'}} width='256' height='144' />;
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
                  let img = <img src={src} style={{backgroundColor: 'grey'}} width='256' height='144' />;
                  let placeholder = <button style={{backgroundColor: 'grey', width: '256', height: '144'}} />
                  return img;
                  //return radiant[n] ? img : placeholder;
                })}
            </div>
          </div>
        </div>
        
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
        
        <div className="heroSelector">
          <div className="search">
            <input type='search' name='search' ref={this.searchRef} className='form-control' />
          </div>
          <button onClick={() => this.searchHeroes()}>Search</button>
          <div className="results flex-row">
            {this.props.results.slice(0, 10).map((hero) => {
              let imgString = this.getImgSrcString(hero.localized_name);
              return <RecommendationElement src={imgString} hero={hero} addHero={this.handleAddHero} />
            })}
          </div>
        </div>

        <button onClick={() => this.resetDraft()}>Reset</button>
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