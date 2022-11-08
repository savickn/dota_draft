
import _ from 'lodash';

import Hero from '../Hero/hero.model';
import Dotabuff from '../HeroData/h_data.model';

import { binaryFeatures, } from './draft.features';

function compareBy(field, a, b) {
  if( a[field] > b[field] ) return -1;
  if( a[field] < b[field] ) return 1;
  return 0;
}

function compareByAdvantage( a, b ) {
  if ( a.advantage > b.advantage ) return -1;
  if ( a.advantage < b.advantage ) return 1;
  return 0;
}

function compareBySynergy( a, b ) {
  if ( a.synergy > b.synergy ) return -1;
  if ( a.synergy < b.synergy ) return 1;
  return 0;
}

function compareByAdjustedWinrate( a, b ) {
  if ( a.adjWrVsDire > b.adjWrVsDire ) return -1;
  if ( a.adjWrVsDire < b.adjWrVsDire ) return 1;
  return 0;
}

// extracts specific matchups from hero.matchups
function getMatchupsForHero(matchups, targets) {
  let res = {};
  matchups.forEach((m) => {
    if(targets.includes(m.enemy)) {
      res[m.enemy] = [m.disadvantage, m.vsWinrate];
    }
  });
  return res;
}

// extracts specific synergies from hero.synergies
function getSynergiesForHero(synergies, targets) {
  let res = {};
  synergies.forEach((s) => {
    if(targets.includes(s.ally)) {
      res[s.ally] = [s.synergy, s.withWinrate];
    }
  });
  return res;
}


export const getHeroRecommendationsByWinrate = async (req, res) => {
  let radiant = req.body.radiant;
  let dire = req.body.dire;
  let banned = req.body.banned ? req.body.banned : [];

  let radiantHeroNames = radiant.map((elem) => elem.localized_name);
  let direHeroNames = dire.map((elem) => elem.localized_name);
  let bannedHeroNames = banned.map((elem) => elem.localized_name);
  
  let inUserHeroes = [...radiantHeroNames, ...direHeroNames, ...bannedHeroNames];

  let rQuery = {'localized_name': {$in: radiantHeroNames}};
  let dQuery = {'localized_name': {$in: direHeroNames}};

  let norArr = inUserHeroes.map((elem) => {
    return { 'localized_name' : elem }; 
  });

  let query = {}; // hero filter query
  
  if(norArr.length > 0) {
    query['$nor'] = norArr; // exclude in-use heroes
  };

  let radiantRes = [];
  let direRes = [];

  let carry = [];
  let mid = [];
  let offlane = [];
  let support = [];
  let hardSupport = [];

  try {
    let radHeroes = await Hero.find(rQuery);
    let direHeroes = await Hero.find(dQuery);
    let recommendedHeroes = await Hero.find(query); 

    // track how recommendedHeroes perform with Radiant
    let aggWithWinrates = {}; 
    let synergies = {};

    // set radiantHero properties 
    // -- winrate/adv vs. dire
    // -- synergies/winrate with radiant 
    for(let r of radHeroes) {
      // filter out currentHero 
      let radiantTargets = radiantHeroNames.filter(n => n.localized_name !== r.localized_name);
      r = r.toObject();
      r['versus'] = getMatchupsForHero(r.matchups, direHeroNames);
      r['with'] = getSynergiesForHero(r.synergies, radiantTargets);
      radiantRes.push(r);

      // calculate matchup metrics for 'recommendedHeroes'
      for(let s of r.synergies) {
        let change = parseFloat(s.synergy);
        synergies[s.ally] = synergies.hasOwnProperty(s.ally) ? 
          synergies[s.ally] + change : change;

        let agg = parseFloat(s.withWinrate);
        aggWithWinrates[s.ally] = aggWithWinrates.hasOwnProperty(s.ally) ? 
          aggWithWinrates[s.ally] + agg : agg;
      }
    }
    console.log('radiantRes -- ', radiantRes);


    // track how recommendedHeroes perform against Dire
    let aggVersusWinrates = {}; 
    let matchupAdvantage = {};

    // set direHero properties 
    // -- winrate/adv vs. radiant
    // -- synergies/winrate with dire
    for(let d of direHeroes) {
      // filter out currentHero 
      let direTargets = direHeroNames.filter(n => n.localized_name !== d.localized_name);
      d = d.toObject();
      d['versus'] = getMatchupsForHero(d.matchups, radiantHeroNames);
      d['with'] = getSynergiesForHero(d.synergies, direTargets);
      direRes.push(d);

      // calculate matchup metrics for 'recommendedHeroes'
      for(let m of d.matchups) {
        let change = parseFloat(m.disadvantage);
        matchupAdvantage[m.enemy] = matchupAdvantage.hasOwnProperty(m.enemy) ? 
          matchupAdvantage[m.enemy] + change : change;

        let agg = (100 - parseFloat(m.vsWinrate));
        aggVersusWinrates[m.enemy] = aggVersusWinrates.hasOwnProperty(m.enemy) ? 
          aggVersusWinrates[m.enemy] + agg : agg;
      }
    }
    console.log('direRes -- ', direRes);


    // set recommendedHero properties
    // -- winrate vs. dire
    // -- synergy with radiant
    for(let h of recommendedHeroes) {
      h = h.toObject();

      h['synergy'] = synergies[h.localized_name] ? synergies[h.localized_name].toFixed(2) : null;
      h['advantage'] = matchupAdvantage[h.localized_name] ? matchupAdvantage[h.localized_name].toFixed(2) : null;
      h['adjWrWithRadiant'] = (aggWithWinrates[h.localized_name] / radHeroes.length).toFixed(2);
      h['adjWrVsDire'] = (aggVersusWinrates[h.localized_name] / direHeroes.length).toFixed(2); 

      if(h.position[0] === '1') carry.push(h);
      if(h.position[1] === '1') mid.push(h);
      if(h.position[2] === '1') offlane.push(h);
      if(h.position[3] === '1') support.push(h);
      if(h.position[4] === '1') hardSupport.push(h);
    }

    // sort each category by winrate increase 
    carry.sort(compareByAdjustedWinrate);
    mid.sort(compareByAdjustedWinrate);
    offlane.sort(compareByAdjustedWinrate);
    support.sort(compareByAdjustedWinrate);
    hardSupport.sort(compareByAdjustedWinrate);

    let recommendations = { 
      'Carry': carry, //carry.slice(0,10), 
      'Mid' : mid, //mid.slice(0,10), 
      'Offlane' : offlane, //offlane.slice(0,10), 
      'Support' : support, //support.slice(0,10), 
      'Hard Support': hardSupport, //hardSupport.slice(0,10), 
    }; 

    let draft = {
      'Radiant': radiantRes,
      'Dire': direRes, 
    };

    //console.log('recommendations -- ', recommendations);

    return res.status(200).json({ 
      recommendations, 
      radiant: radiantRes,
      dire: direRes,
    });

  } catch(err) {
    console.log(err);
    return res.status(500).send(err);
  }
}


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
