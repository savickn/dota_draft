
const puppeteer = require('puppeteer');

const helpers = require('./helpers');

const Promotion = require('../../../server/api/Promotion/promotion.model');

/*
** entry method for scraping site-wide promos from all e-commerce sites
*/
const scrapeAllPromos = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  //const gapPromos = await scrapeGapPromos(page);
  const brPromos = await scrapeBrPromos(page);
  //const onPromos = await scrapeOnPromos(page);

  for(let promo in brPromos) {
    


  }
}


/*
** GAP promos (NOT WORKING)
*/
const scrapeGapPromos = async (page) => {
  const url = 'https://www.gapcanada.ca/';
  await page.goto(url, {waitUntil: 'load',  timeout: 0});
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

  let promoStrings = [];

  const iFrameUrls = await page.evaluate(async () => {
    const urls = [];

    const iFrameBtns = [...document.querySelectorAll('div.pd__details')];
    console.log('iFrameBtns --> ', iFrameBtns);
    for(let btn of iFrameBtns) {
      let link = btn.querySelector('a');
      link.click();
      let popup = document.querySelector('iframe#pd__popup');
      urls.push(popup.src);
    }
    return urls;
  });

  console.log('iFrameUrls --> ', iFrameUrls);

  /*for(let u of iFrameUrls) {
    await helpers.sleep(1000);
    page.goto(u, {waitUntil: 'load',  timeout: 0});
    let promo = await page.evaluate(async () => {
      let c = document.querySelector('div#legalContainer');
      console.log('legalContainer --> ', c);
      return c;
    })
    promoStrings.push(promo);
  }*/

  console.log('promoStrings --> ', promoStrings);
  return promoStrings;
}

/*
** BR promos (WORKING)
*/
const scrapeBrPromos = async (page) => {
  const url = 'https://bananarepublic.gapcanada.ca/';
  await page.goto(url, {waitUntil: 'load' /*'networkidle2'*/,  timeout: 0});

  const iframeUrl = await page.evaluate(async () => {
    const iframeBtn = document.querySelector('div.wcd_headline__text > button');
    iframeBtn.click();

    const iframe = document.querySelector('iframe#iframe');
    return iframe.src;
  });

  console.log('iframeUrl --> ', iframeUrl);
  await page.goto(iframeUrl, {waitUntil: 'load' /*'networkidle2'*/,  timeout: 0});

  return await page.evaluate(async () => {
    return [...document.querySelectorAll('p')].map((p) => {
      console.log('textContent --> ', p.textContent);
      return p.textContent;
    });
  });
}

/*
** ON promos (NOT WORKING)
*/
const scrapeOnPromos = async (page) => {
  const url = 'https://oldnavy.gapcanada.ca/';
  await page.goto(url, {waitUntil: 'load' /*'networkidle2'*/,  timeout: 0});

  return await page.evaluate(async () => {
    const promoStrings = [];

    const promoDivs = [...document.querySelectorAll('div.promoDrawer__content__item__banner')];
    console.log('# of promos --> ', promoDivs.length);
    for(let p of promoDivs) {
      const img = p.querySelector('img');
      if(img) {
        console.log('promo description --> ', img.alt);
        promoStrings.push(img.alt);
      }
    }

    console.log('ON promoStrings --> ', promoStrings);
    return promoStrings;
  });
}


/*
** create Promotion db entry
*/
const createPromo = (data) => {
  const promoObj = {};

  Promotion.create(promoObj, (err, promo) => {
    if(err) console.log('createPromo err --> ', err);
    console.log('createPromo promo --> ', promo);
  });
}

/*
** analyze promo string
*/
const extractPromoFromString = (str) => {

}



module.exports = {
  scrapeAllPromos,
};