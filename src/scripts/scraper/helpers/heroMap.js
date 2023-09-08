
let heroMap = {};

export const setHeroMap = (hm) => {
  heroMap = hm;
}

export const getHeroFromMap = (id) => {
  return heroMap[id];
}



