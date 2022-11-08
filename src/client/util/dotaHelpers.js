
// converts hero name (e.g. Beastmaster) to valid img src
export const getImgSrcString = (name) => {
  let nameArr = name.split(' ');
  let imgString = '/assets/';
  for(let substr of nameArr) {
    imgString += `${substr}_`;
  }
  imgString += 'icon.webp';
  return imgString;
}

export const calcPhysicalResistance = (armor) => {
  let Dm = 1 - ((0.06 * armor) / (1 + (0.06 * Math.abs(armor))));
  let R = 1 - Dm;
  return R;
}

export const calcAttackRate = (bat, attackSpeed) => {
  return (attackSpeed) / (100 * bat);
}

// attack_rate in attacks per second
export const calcDPS = (attackRate, attackDamage) => {
  return attackDamage * attackRate;
}


