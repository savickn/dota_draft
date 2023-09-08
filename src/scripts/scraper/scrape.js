
import Hero from '../../server/api/Hero/hero.model'; 

import puppeteer from 'puppeteer';
import redis_client from '../dependencies/redis';

import stratz from './logic/stratz';
import dotabuff from './logic/dotabuff';
import protracker from './logic/protracker';
import opendota from './logic/opendota';

import * as hm from './helpers/heroMap';
import * as helpers from './helpers/helpers';
import * as constants from './helpers/constants';

//import * as controller from '../../server/api/HeroData/h_data.controller';
//import * as controller from '../../server/api/Hero/hero.controller';


const EXECUTABLE_PATH = '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const USER_DATA_DIR = '/mnt/c/Users/Nick/Desktop/chrometest';

export const scrapeAll = async () => {
  const browser = await puppeteer.launch({ 
    executablePath: EXECUTABLE_PATH,
    userDataDir: USER_DATA_DIR,  
    headless: false, 
    ignoreDefaultArgs: ['--disable-extensions'],
    args:[ 
      '--start-maximized', // you can also use '--start-fullscreen' 
      //'--no-sandbox',
    ] 
  }); 
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900});
  
  /* write logs to shell console instead of browser console
  page.on('console', msg => {
    console.log(msg.text());
    for (let i = 0; i < msg.args().length; i++) {
      console.log(msg.args()[i]);
    }
  }); 
  */

  let heroes = await Hero.find({}, 'id localized_name -_id');
  //console.log(heroes);

  let heroMap = {};
  heroes.map((h) => {
    heroMap[h.id] = h.localized_name;
  });
  //console.log(heroMap);

  let currentIndex = 0;
  try {

  /* dotabuff -- COUNTERS */
  /*let links = await dotabuff.scrapeHeroes(page);
  console.log(links);

  for(let link of links) {
    let hero = await dotabuff.scrapeMatchups(page, link);
    console.log("hero -- ", hero);
    let res = await controller.updateMatchups(hero.hero, hero.winrate, hero.matchups);
  }*/

  /* stratz -- SYNERGIES */
  /*for(let h of heroes) {
    let hero = await stratz.scrapeSynergies(page, h.id);
    hero['name'] = heroMap[hero.id];
    hero.synergies.forEach((s) => {
      s['ally'] = heroMap[s.ally];
    });
    //console.log("hero -- ", hero);
    await controller.updateSynergies(hero.name, hero.synergies);
  }*/

  /* protracker -- POSITIONS */
  let hs = Object.values(heroMap);
  for(let h of hs.slice(28)) { 
    let position = await protracker.scrapePositions(page, h);
    console.log(h, ' -- ', position);
    await controller.updatePosition(h, position);
  }

  /* opendota -- hero stats */
  //let heroJson = await opendota.scrapeStats();
  //console.log(heroJson);
  /*for(let id of Object.keys(heroMap)) {
    let target = heroJson[id];
    let primaryAttr = target['primary_attr'];
    
    let obj = {};
    
    let s_str = target['base_str'];
    let s_agi = target['base_str'];
    let s_int = target['base_str'];
    
    let s_dmg_bonus = 0;
    if(primaryAttr === 'agi') {
      s_dmg_bonus += s_agi;
    } else if(primaryAttr === 'str') {
      s_dmg_bonus += s_str;
    } else {
      s_dmg_bonus += s_int;
    }

    obj['base_health'] = target['base_health'];
    obj['base_health_regen'] = target['base_health_regen'];

    obj['base_mana'] = target['base_mana'];
    obj['base_mana_regen'] = target['base_mana_regen'];
    
    obj['base_armor'] = target['base_armor'];
    obj['base_health'] = target['base_health'];
    obj['base_magic_resistance'] = target['base_mr'] / 100;

    obj['base_attack_damage'] = (target['base_attack_min'] + target['base_attack_max']) / 2;
    obj['base_attack_speed'] = constants.getBASByName(heroMap[id]);
    obj['bat'] = target['attack_rate'];
    obj['move_speed'] = target['move_speed'];

    obj['base_str'] = s_str;
    obj['base_agi'] = s_agi;
    obj['base_int'] = s_int;
    obj['str_gain'] = target['str_gain'];
    obj['agi_gain'] = target['agi_gain'];
    obj['int_gain'] = target['int_gain'];

    obj['s_health'] = target['base_health'] + (20 * s_str);
    obj['s_health_regen'] = target['base_health_regen'] + (0.1 * s_str);
    obj['s_armor'] = target['base_armor'] + (0.167 * s_agi);
    obj['s_attack_speed'] = obj['base_attack_speed'] + (1 * s_agi)
    obj['s_mana'] = target['base_mana'] + (12 * s_int);
    obj['s_mana_regen'] = target['base_mana_regen'] + (0.05 * s_int);
    obj['s_attack_damage'] = obj['base_attack_damage'] + s_dmg_bonus;
    obj['s_attack_rate'] = calcAttackRate(obj['bat'], obj['s_attack_speed']);
    obj['s_physical_resistance'] = calcPhysicalResistance(obj['s_armor']);
    obj['s_dps'] = calcDPS(obj['s_attack_rate'], obj['s_attack_damage']);

    console.log(heroMap[id], ' --- ', obj);
    await controller.updateBaseStats(id, obj);
  }*/
  } catch(e) {
    console.log(e);
    throw e;
  }

  console.log("DONE!");
}




function calcPhysicalResistance(armor) {
  let Dm = 1 - ((0.06 * armor) / (1 + (0.06 * Math.abs(armor))));
  let R = 1 - Dm;
  return R;
}

function calcAttackRate(bat, attackSpeed) {
  return (attackSpeed) / (100 * bat);
}

// attack_rate in attacks per second
function calcDPS(attackRate, attackDamage) {
  return attackDamage * attackRate;
}


