
import _ from 'lodash';

import Hero from '../Hero/hero.model';

import { binaryFeatures, } from './draft.features';



/* used to acquire best hero pick */
export const getHeroRecommendations = (req, res) => {
  let radiant = req.body.radiant;
  let dire = req.body.dire;

  let query = {};

  let carry = [];
  let mid = [];
  let offlane = [];
  let support = [];
  let hardSupport = [];


  let allyFeatures = {
    Melee: 0,
    Ranged: 0,
    str: 0,
    agi: 0,
    int: 0, 
  }

  // analyze ally heroes
  for(let r of radiant) {
    allyFeatures[r.attr]++;
    allyFeatures[r.attack_type]++;

    for(let f of r.utilities) {
      _.has(allyFeatures, f) ? allyFeatures[f]++ : allyFeatures[f] = 1; 
    }

    for(let f of r.stats) {
      let name = f.feature;
      let val = Number(f.value);
      _.has(allyFeatures, name) ? allyFeatures[name] += val : allyFeatures[name] = val; 
    }

    for(let c of r.contributions) {
      let name = c.feature;
      let val = Number(c.value);
      _.has(allyFeatures, name) ? allyFeatures[name] += val : allyFeatures[name] = val; 
    }
  }

  console.log('allyFeatures --> ', allyFeatures);


  // track aggregates of enemy team
  let enemyFeatures = {
    Melee: 0,
    Ranged: 0,
    str: 0,
    agi: 0,
    int: 0, 
  }

  let enemyWeaknesses = {};

  // collect aggregate data of enemy heroes
  for(let d of dire) {
    enemyFeatures[d.attr]++;
    enemyFeatures[d.attack_type]++;

    for(let f of d.utilities) {
      _.has(enemyFeatures, f) ? enemyFeatures[f]++ : enemyFeatures[f] = 1; 
    }

    for(let s of d.stats) {
      let name = s.feature;
      let val = Number(s.value);
      _.has(enemyFeatures, name) ? enemyFeatures[name] += val : enemyFeatures[name] = val; 
    }

    for(let c of d.contributions) {
      let name = c.feature;
      let val = Number(c.value);
      _.has(enemyFeatures, name) ? enemyFeatures[name] += val : enemyFeatures[name] = val; 
    }

    for(let w of d.weaknesses) {
      let key = w.feature;
      let val = Number(w.multiplier);
      _.has(enemyWeaknesses, key) ? enemyWeaknesses[key] += val : enemyWeaknesses[key] = val;
    }

  }

  console.log('enemyFeatures --> ', enemyFeatures);
  console.log('enemyWeaknesses --> ', enemyWeaknesses);

  // metrics
  let positions = {}; // missing positions  
  let needs = {}; // our team needs
  let weaknesses = {}; // enemy weaknesses 



  // find heroes that fill these roles
  Hero.find(query, function(err, heroes) {
    if (err) { return res.status(500).send(err); };

    let trimmedHeroes = [];
  
    // trim results
    for(let h of heroes) {
      let score = 0;

      // subtract points if enemies counter hero 'h'
      for(let w of h.weaknesses) {
        if(_.has(enemyFeatures, w.feature)) {
          score -= enemyFeatures[w.feature];
        }
      }

      // add points if hero 'h' is strong against enemies
      for(let s of h.strengths) {
        if(_.has(enemyFeatures, s.feature)) {
          score += enemyFeatures[s.feature] * s.multiplier;
        }
      }


      let features = h.stats.concat(h.contributions);
      for(let k of Object.keys(enemyWeaknesses)) {
        let v = enemyWeaknesses[k];

        // add points if enemies are weak against hero 'h' 
        if(_.has(h.utilities, k)) {
          score += 1;
        }

        // add points if enemies are weak against hero 'h' 
        if(_.has(features, k)) {
          //score += features[k];
        }
      }
      
      h.score = score;

      console.log(h.localized_name, h.score);

      if(score >= 0) {
        trimmedHeroes.push(h);
      }
    }
    
    //console.log('trimmedHeroes --> ', trimmedHeroes.slice(0, 10));
    
    // sort trimmed heroes

    // send to client
    for(let h of trimmedHeroes) {
      if(h.position[0] === '1') carry.push(h);
      if(h.position[1] === '1') mid.push(h);
      if(h.position[2] === '1') offlane.push(h);
      if(h.position[3] === '1') support.push(h);
      if(h.position[4] === '1') hardSupport.push(h);
    };

    let recommendations = { 
      'Carry': carry, 
      'Mid' : mid, 
      'Offlane' : offlane, 
      'Support' : support, 
      'Hard Support': hardSupport, 
    };

    return res.status(200).json({ recommendations });
  });
}
