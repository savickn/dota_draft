
const puppeteer = require('puppeteer');
const path = require('path');
const util = require('util');

const scrapers = require('./scrape'); 

const dotabuff = require('./logic/dotabuff'); 

const testAll = async () => { 
  const browser = await puppeteer.launch({ 
    headless: false, 
    ignoreDefaultArgs: ['--disable-extensions'],
    args:[ 
      '--start-maximized', // you can also use '--start-fullscreen' 
      //'--no-sandbox',
    ] 
  }); 
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900});

  await testDotabuff(page);
  //await testCounters(page);
}


const testDotabuff = async (page) => {
  let heroes = await dotabuff.scrapeHeroes(page);
  for(let h of heroes) {
    console.log(h);
  }  

  console.log('Dotabuff test end');
}


const testCounters = async (page) => {
  const target = "https://www.dotabuff.com/heroes/ursa/counters";

  let heroes = await dotabuff.scrapeMatchups(page, target);
  for(let h of heroes) {
    console.log(h);
  }  

  console.log('Dotabuff test end');
}




module.exports = {
  testAll, 
};


