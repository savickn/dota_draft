
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as helpers from './helpers';

import { getImgSrcString, } from '../../util/dotaHelpers';

import Modal from '../Utility/Modal/modal';

import { openModal, closeModal, } from '../Utility/Modal/modalActions';

class LaneMatchup extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      radiant: props.radiant,
      dire: props.dire,
      heroChoices: [], // used to supply choices when choosing hero for particular position
      positionInProgress: null, 
      targetTeam: null, 
    };
  }

  componentDidMount() {

  }

  // manually choose position
  choosePositionMenu = (team, position, heroes) => {
    let newState = {
      heroChoices: heroes,
      positionInProgress: position, 
      targetTeam: team, 
    };
    this.setState(newState, () => {
      this.props.dispatch(openModal());
    })
  }

  choosePosition = (hero) => {

  }

  // change hero assigned to position 'p'
  editPosition = () => {

  }

  // to build 'n' images
  buildImgArray = (count, width, height, target) => {
    console.log(target);
    return Array.from(Array(count).keys()).map((n) => {
      let subArray = target[n];
      // if sub-array is empty return empty img
      if(!subArray || subArray.length < 1) {
        return <img src={'//:0'} style={{backgroundColor: 'grey'}} 
          width={width} height={height} />
      }

      // if sub-array has only 1 entry
      if(subArray.length === 1) {
        let src = getImgSrcString(subArray[0].localized_name);
        return <img src={src} style={{backgroundColor: 'grey'}} 
          width={width} height={height} 
          onClick={null} />;
      }

      // otherwise have button to choose for each position
      return (
        <button style={{backgroundColor: 'grey'}} 
          width={width} height={height} 
          onClick={(e) => this.choosePositionMenu('Radiant', 'C', subArray)}>
            Choose Hero
        </button>
      );
    });
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  }

  render() {
    let { radiant, dire, heroChoices, } = this.state; 
    console.log('lane state -- ', this.state);

    return (
      <div className='flex-column'>
        <div className="rad">
          {this.buildImgArray(radiant.length, '128', '72', radiant)}
        </div>
        <div> VS. </div>
        <div className="dire">
          {this.buildImgArray(dire.length, '128', '72', dire)}
        </div>

        <Modal close={this.closeModal}> 
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
        </Modal>
      </div>
    )
  }
}

LaneMatchup.propTypes = {
  radiant: PropTypes.array.isRequired,
  dire: PropTypes.array.isRequired,
  lane: PropTypes.string.isRequired, 
  changePosition: PropTypes.func.isRequired, 
};

const mapStateToProps = (state) => {
  return {

  };
};

export default connect(mapStateToProps)(LaneMatchup);