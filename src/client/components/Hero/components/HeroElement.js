
import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

/*
** styles/assets
*/
import noPic from '../../../assets/no_image.png';
import styles from './HeroElement.scss';

class HeroElement extends React.Component {
  
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
    //console.log(hero);
    //const { url, imageSrc, name, } = this.props.hero.assets[0]; 
    const img = /*imageSrc ||*/ noPic;

    return hero ? (
      <div className={styles.heroFlexItem}>
        <img src={src} width='128' height='72' />
        <Link to={`heroes/${hero._id}`}>{hero.localized_name}</Link>
      </div>
    ) : <div></div>;
  }
}

HeroElement.propTypes = {
  hero: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
  }).isRequired, 
}

export default HeroElement;
