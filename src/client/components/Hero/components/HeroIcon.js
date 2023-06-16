
import React from 'react';
import PropTypes from 'prop-types';

import { getImgSrcString, } from '../../../util/dotaHelpers';

import styles from './HeroIcon.scss';

// represents a hero icon that can have an optional onClick handler
class HeroIcon extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    const { hero, i_height, i_width, } = this.props;
    let src = getImgSrcString(hero.localized_name); 

    return hero ? (
      <div onClick={() => this.props.clickHandler(hero)} >
        <img src={src} width={i_width} height={i_height} />
      </div>
    ) : <div></div>;
  }
}

HeroIcon.propTypes = {
  hero: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
  }).isRequired, 
  i_width: PropTypes.string.isRequired,
  i_height: PropTypes.string.isRequired, 
  clickHandler: PropTypes.func, 
}

export default HeroIcon;
