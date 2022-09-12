
import Hero from '../../server/api/Hero/hero.model';



export const setHeroDefaults = async () => {
  Hero.find({}, function(err, heroes) {
    if(err) return "Failed";
    let msg = 'Success';
    for(let h of heroes) {
      await h.save();
    }
    return msg;
  })
}

