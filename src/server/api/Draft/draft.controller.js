
import _ from 'lodash';

import Hero from '../Hero/hero.model';
import Dotabuff from '../HeroData/h_data.model';

import { binaryFeatures, } from './draft.features';


function compareByWinrate( a, b ) {
  if ( a.advantage > b.advantage ){
    return -1;
  }
  if ( a.advantage < b.advantage ){
    return 1;
  }
  return 0;
}

function compareByAdjustedWinrate( a, b ) {
  if ( a.adjustedWinrate > b.adjustedWinrate ) return -1;
  if ( a.adjustedWinrate < b.adjustedWinrate ) return 1;
  return 0;
}

function getMatchupsForHero(matchups, targets) {
  let res = {};
  console.log('getMatchups matchups -- ', matchups);
  console.log('getMatchups targets -- ', targets);
  matchups.forEach((m) => {
    if(targets.includes(m.enemy)) {
      res[m.enemy] = [m.disadvantage, m.vsWinrate];
    }
  });
  console.log('getMatchups res -- ', res);
  return res;
}


export const getHeroRecommendationsByWinrate = async (req, res) => {
  let radiant = req.body.radiant;
  let dire = req.body.dire;

  let radiantHeroNames = radiant.map((elem) => elem.localized_name);
  let direHeroNames = dire.map((elem) => elem.localized_name);
  let inUserHeroes = [...radiantHeroNames, ...direHeroNames];

  let rQuery = {'localized_name': {$in: radiantHeroNames}};
  let dQuery = {'localized_name': {$in: direHeroNames}};

  let norArr = inUserHeroes.map((elem) => {
    return { 'localized_name' : elem }; 
  });

  console.log('norArr -- ', norArr);

  let query = {}; // hero filter query
  
  if(norArr.length > 0) {
    query['$nor'] = norArr; // exclude in-use heroes
  };

  let carry = [];
  let mid = [];
  let offlane = [];
  let support = [];
  let hardSupport = [];

  try {
    let radHeroes = await Hero.find(rQuery);
    let direHeroes = await Hero.find(dQuery);
    let heroes = await Hero.find(query); 
    let allData = await Dotabuff.find({});

    console.log('allData -- ', allData);

    let matchups = {};
    let overallWinrates = {}; // stores overall winrates for all heroes

    for(let e of allData) {
      overallWinrates[e.hero] = e.winrate;
      matchups[e.hero] = e.matchups;
    }

    console.log('overallWinrates -- ', overallWinrates);

    let radiantData = await Dotabuff.find({'hero': { $in: radiantHeroNames }})
    let direData = await Dotabuff.find({'hero': { $in: direHeroNames }}); 

    console.log('radiantData -- ', radiantData);
    console.log('direData -- ', direData);

    let netWinrates = {}; 
    let aggWinrates = {};

    for(let d of direData) {
      for(let m of d.matchups) {
        let change = parseFloat(m.disadvantage);
        netWinrates[m.enemy] = netWinrates.hasOwnProperty(m.enemy) ? 
          netWinrates[m.enemy] + change : change;

        let agg = (100 - parseFloat(m.vsWinrate));
        aggWinrates[m.enemy] = aggWinrates.hasOwnProperty(m.enemy) ? 
          aggWinrates[m.enemy] + agg : agg;
      }
    }

    console.log('winrates -- ', netWinrates);
    console.log('aggWinrates -- ', aggWinrates);

    // send to client
    for(let h of heroes) {
      h = h.toObject();
      h['matchups'] = matchups[h.localized_name];
      h['advantage'] = netWinrates[h.localized_name];
      h['adjustedWinrate'] = aggWinrates[h.localized_name] / direData.length; 
      h['overallWinrate'] = overallWinrates[h.localized_name];

      if(h.position[0] === '1') carry.push(h);
      if(h.position[1] === '1') mid.push(h);
      if(h.position[2] === '1') offlane.push(h);
      if(h.position[3] === '1') support.push(h);
      if(h.position[4] === '1') hardSupport.push(h);
    };

    let radiantRes = [];
    for(let h of radHeroes) {
      h = h.toObject();
      let matchups = radiantData.filter(e => e.hero === h.localized_name)[0].matchups;
      h['matchups'] = getMatchupsForHero(matchups, direHeroNames);
      radiantRes.push(h);
    }

    let direRes = [];
    for(let h of direHeroes) {
      h = h.toObject();
      let matchups = direData.filter(e => e.hero === h.localized_name)[0].matchups;
      h['matchups'] = getMatchupsForHero(matchups, radiantHeroNames);
      direRes.push(h);
    }

    // sort each category by winrate increase 
    carry.sort(compareByAdjustedWinrate);
    mid.sort(compareByAdjustedWinrate);
    offlane.sort(compareByAdjustedWinrate);
    support.sort(compareByAdjustedWinrate);
    hardSupport.sort(compareByAdjustedWinrate);

    let recommendations = { 
      'Carry': carry.slice(0,10), 
      'Mid' : mid.slice(0,10), 
      'Offlane' : offlane.slice(0,10), 
      'Support' : support.slice(0,10), 
      'Hard Support': hardSupport.slice(0,10), 
    }; 

    let draft = {
      'Radiant': radiantRes,
      'Dire': direRes, 
    }

    //console.log('recommendations -- ', recommendations);

    return res.status(200).json({ recommendations, draft });

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
