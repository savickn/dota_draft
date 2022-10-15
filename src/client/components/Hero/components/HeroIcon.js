
import React from 'react';
import PropTypes from 'prop-types';

import styles from './HeroIcon.scss';

// represents a hero icon that can have an optional onClick handler
class HeroIcon extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {};
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
  
  render() {
    const hero = this.props.hero;
    let src = this.getImgSrcString(hero.localized_name); 

    return hero ? (
      <div onClick={() => this.props.clickHandler(hero)} >
        <img src={src} width='128' height='72' />
      </div>
    ) : <div></div>;
  }
}

HeroIcon.propTypes = {
  hero: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
  }).isRequired, 
  clickHandler: PropTypes.func, 
}

export default HeroIcon;
