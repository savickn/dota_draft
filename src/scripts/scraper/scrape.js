
import puppeteer from 'puppeteer';
//import redis_client from '../redis';

import dotabuff from './logic/dotabuff';

import * as helpers from './helpers/helpers';


export const scrapeAll = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  
  /* write logs to shell console instead of browser console
  page.on('console', msg => {
    console.log(msg.text());
    for (let i = 0; i < msg.args().length; i++) {
      console.log(msg.args()[i]);
    }
  }); 
  */

  await scrapeBR(page);
}



// scrape page urls from website
export const scrapeLinks = async (page, url, linkScraper) => {
  await page.goto(url, {waitUntil: 'networkidle2',  timeout: 0});

  const links = await linkScraper(page);
  console.log('\n \n scrapedLinks --> ', links);

  // return redis_client.lrange(url, 0, -1, (existingLinks) => {
  //   console.log('\n \n existingLinks --> ', existingLinks);

  //   const joinedArr = _.union(links, existingLinks);
  //   console.log('\n \n joinedArr --> ', joinedArr);

  //   return joinedArr;
  // });

  // redis_client.rpush.apply(redis_client, [url].concat(links));

  return links;
}


// scrape price/colors/sizes from product pages
export const scrapeProduct = async (page, links, scraper) => {
  for(let l of links) {
    await helpers.sleep(2500);

    try {
      let productData = await scraper(page, l);
      console.log('\n productData --> ', productData);
    
      for(let p of productData) {
        // guard against empty objects
        if(!p.name) continue;

        let product = {
          url: l, 
          outOfStock: false, 
          ...p,  
          keywords: analytics.analyzeKeywords(p.name),  
        };

        //console.log('\n scrapeProduct finalProduct --> ', product);

        let newProduct = await ProductController.upsertProduct(product);

        console.log('\n scrapeProduct newProduct --> ', newProduct);

        // now create priceHistory
        let colorObj = {
          price: p.currentPrice,
          date: Date.now(),
          productId: newProduct._id, 
        }
        await HistoryController.savePrice(colorObj);
      }
    } catch(err) {
      console.log('scrapeProduct err --> ', err);
    }
  }
}

