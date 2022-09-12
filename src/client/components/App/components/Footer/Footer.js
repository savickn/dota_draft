import React from 'react';

import styles from './Footer.scss';

import bg from './footer-bk.png';
console.log('footer background --> ', bg);

export function Footer() {
  return (
    <div style={{ backgroundImage: `url(${bg})` }} className={styles.footer}>
      <p>&copy; 2016</p>
    </div>
  );
}

export default Footer;
