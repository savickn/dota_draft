


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



export const calcD = (radHeroes, direHeroes, pool) => {

  let radiantHeroNames = radHeroes.map((elem) => elem.localized_name);
  let direHeroNames = direHeroes.map((elem) => elem.localized_name);

  let radiantRes = []; // radiant heroes
  let direRes = []; // dire heroes

  let carry = [];
  let mid = [];
  let offlane = [];
  let support = [];
  let hardSupport = [];


  // track how recommendedHeroes perform with Radiant
  let aggWithWinrates = {}; 
  let synergies = {};

  // set radiantHero properties 
  // -- winrate/adv vs. dire
  // -- synergies/winrate with radiant 
  for(let r of radHeroes) {
    // filter out currentHero 
    let radiantTargets = radiantHeroNames.filter(n => n.localized_name !== r.localized_name);
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
  for(let h of pool) {
    h['synergy'] = synergies[h.localized_name] ? synergies[h.localized_name].toFixed(2) : null;
    h['advantage'] = matchupAdvantage[h.localized_name] ? matchupAdvantage[h.localized_name].toFixed(2) : null;
    h['adjWrWithRadiant'] = (aggWithWinrates[h.localized_name] / radHeroes.length).toFixed(2);
    h['adjWrVsDire'] = (aggVersusWinrates[h.localized_name] / direHeroes.length).toFixed(2); 

    console.log(h['adjWrVsDire']);
    console.log(h['advantage']);
    //if(h['adjWrVsDire'] < 50) continue; // filter out negative winrate heroes
    //if(h['advantage'] < -1) continue; // filter out negative advantage heroes

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

  return { 
    recommendations, 
    radiant: radiantRes,
    dire: direRes,
  };
}