

export const isFresh = () => {
  const heroData = localStorage.getItem('heroes');
  if(heroData) {
    contents = JSON.parse(heroData);
    curr = Date.now();
    return curr - contents.timestamp < 604800000;
  } else {
    return false;
  }
}

export const loadHeroes = () => {
  return JSON.parse(localStorage.getItem('heroes')).heroes;
}

export const saveHeroes = (heroes) => {
  localStorage.setItem('heroes', JSON.stringify({
    timestamp: Date.now(),
    heroes
  }));
}

