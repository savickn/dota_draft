
import HeroData from './h_data.model';

export const getHeroDataByName = async (req, res) => {
  try {

  } catch(e) {
    
  }
}


export const addOrUpdateHero = async (name, payload) => {
  try {
    let res = await HeroData.findOneAndUpdate({ hero: name }, payload, {
      upsert: true,
      new: true, 
    });
    return res;
  } catch(e) {
    console.log(e);
  }
}; 

