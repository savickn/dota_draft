
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as helpers from './helpers';

import { getImgSrcString, } from '../../util/dotaHelpers';

import Modal from '../Utility/Modal/modal';

import { openModal, closeModal, } from '../Utility/Modal/modalActions';

import { updateLanesSuccess, } from '../Draft/DraftActions';

let defaultState = { 
  heroChoices: [],
  positionInProgress: null,
  targetTeam: null, 
} 

class LaneMatchup extends React.Component { 
  
  constructor(props) {
    super(props);
    this.state = {
      heroChoices: [], // used to supply choices when choosing hero for particular position
      positionInProgress: null, // in ['C', 'M', 'O', '4', '5'] 
      targetTeam: null, // in ['r', 'd']
      modalId: `${props.lane}_modal`, 
    };
  }

  componentDidMount() {

  }

  // manually choose position
  choosePositionMenu = (team, position, heroes) => {
    console.log('choosePosMenu -- ', team, position, heroes);
    let newState = {
      heroChoices: heroes,
      positionInProgress: position, 
      targetTeam: team, 
    };
    this.setState(newState, () => {
      this.props.dispatch(openModal(this.state.modalId));
    })
  }

  choosePosition = (hero) => {
    console.log(hero);
    // this.props.dispatch(setPosition());
    let { positionInProgress, targetTeam, modalId, } = this.state;
    let pos = `${targetTeam}_${positionInProgress}`;
    this.props.updatePosition(pos, hero);
    
    
    /*let positions = {
      [`${targetTeam}_${positionInProgress}`]: [ hero ], 
    }*/
    //this.props.dispatch(updateLanesSuccess(positions));
    this.props.dispatch(closeModal(modalId));
  }

  // change hero assigned to position 'p'
  editPosition = () => {

  }

  // to build 'n' images
  // target is object like {r_C: , r_5: }
  buildImgArray = (target) => {
    let width = '128';
    let height = '72';

    //console.log(target);
    return Object.keys(target).map((k) => {
      let subArray = target[k];
      let team = k.charAt(0);
      let position = k.charAt(2);

      //console.log(k, ' -- ', subArray);

      // if sub-array is empty return empty img
      if(!subArray || subArray.length < 1) {
        return <img src={'//:0'} style={{backgroundColor: 'grey'}} 
          width={width} height={height} draggable="true" />
      }

      // if sub-array has only 1 entry
      if(subArray.length === 1) {
        let src = getImgSrcString(subArray[0].localized_name);
        return <img src={src} style={{backgroundColor: 'grey'}} 
          width={width} height={height} draggable="true"
          onClick={null} />;
      }

      // otherwise have button to choose for each position
      return (
        <button onClick={(e) => this.choosePositionMenu(team, position, subArray)}>
            Choose Hero
        </button>
      );
    });
  }

  closeModal = () => {
    this.setState(defaultState);
  }

  render() {
    let { heroChoices, modalId } = this.state; 
    let { radiant, dire, } = this.props; 
    console.log('lane state -- ', this.state);
    console.log('lane props -- ', this.props);

    return (
      <div className='flex-column'>
        <div className="rad">
          {this.buildImgArray(radiant)}
        </div>
        <div> VS. </div>
        <div className="dire">
          {this.buildImgArray(dire)}
        </div>

        <Modal close={this.closeModal} identifier={modalId}> 
          <div>
            <div>Choose a hero:</div>
            { heroChoices && heroChoices.map(c => {
              let src = getImgSrcString(c.localized_name);
              return (
                <div>
                  <img src={src} width='256' height='144' 
                    onClick={() => this.choosePosition(c)} />
                </div>
              );
            })}
          </div>
        </Modal>
      </div>
    )
  }
}

LaneMatchup.propTypes = {
  radiant: PropTypes.array.isRequired,
  dire: PropTypes.array.isRequired,
  lane: PropTypes.string.isRequired, // used to separate Modals 
  updatePosition: PropTypes.func.isRequired, 
};

const mapStateToProps = (state) => {
  return {

  };
};

export default connect(mapStateToProps)(LaneMatchup);