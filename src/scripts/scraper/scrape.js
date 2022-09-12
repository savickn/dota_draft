

import puppeteer from 'puppeteer';
// const path = require('path');
// const util = require('util');
// const _ = require('lodash');

import redis_client from '../redis';

import br from './logic/br';
//const gap = require('./logic/gap');
//const jcrew = require('./logic/jcrew');
import md from './logic/md';


import * as analytics from './helpers/analytics';
import * as helpers from './helpers/helpers';
import * as ProductController from '../../server/api/Product/product.controller';
import * as HistoryController from '../../server/api/PriceHistory/price.controller';


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
  //await scrapeGAP(page);
  //await scrapeON(page);
  //await scrapeJC(page);
}

export const scrapeBR = async (page) => {
  // scrape links from sale page
  const url = 'https://bananarepublic.gapcanada.ca/browse/category.do?cid=1014757&sop=true';
  const links = await scrapeLinks(page, url, br.scrapeBananaSale);
  //const links = ['https://bananarepublic.gapcanada.ca/browse/product.do?pid=550363003&cid=1091405&pcid=1014757&vid=1&grid=pds_0_921_1#pdp-page-content']

  // scrape product data from links
  await scrapeProduct(page, links, br.scrapeBananaProduct);
}

export const scrapeMD = async (page) => {
  //const url = 'https://bananarepublic.gapcanada.ca/browse/category.do?cid=1014757&sop=true';
  try {
    const products = await md.scrapeProducts(page);
  
    for(let p of products) {
      // guard against empty objects
      if(!p.name) continue;

      let product = {
        //url: l, 
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





// scrape page urls from websites
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

  redis_client.rpush.apply(redis_client, [url].concat(links));

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



/*

const scrapeGAP = async (page) => {
  // scrape current promotions from home page
  // NOT IMPLEMENTED

  // scrape links from sale page
  const links = await gap.scrapeGapSale(page);

  // scrape price/colors/sizes from product pages
  await scrapeProduct(page, links, gap.scrapeGapProduct);
}

const scrapeJC = async () => {
  // scrape current promotions from home page
  // NOT IMPLEMENTED

  const links = await jcrew.scrapeJcrewSale(page); // scrape links from sale page

  await scrapeProduct(page, links, jcrew.scrapeJcrewProduct); // scrape price/colors/sizes from product pages
}

*/


/* Product Page Logic */

//await page.screenshot({path: path.resolve('output', 'example.png')});
//await page.pdf({path: path.resolve('output', 'hn.pdf'), format: 'A4'});

/*const images = [...document.querySelectorAll('img.swatches--image')];
const imageNames = images.map((img) => {
  return img.getAttribute('alt');
})*/

  //const colorRadios = [...document.querySelectorAll('input.swatch__radio')];
  
  // should contain entries for each color and subcategories for price/sizes
  /*const colors = colorRadios.map((cr) => {
    const colorName = cr.getAttribute('value');
    cr.click();

    const sizeRadios = [...document.querySelectorAll('input.swatches--radio')]
    const sizes = sizeRadios.map((sr) => {
      return sr.getAttribute('value');  //sr.textContent.trim();
    })

    return {
      colorName,
      // colorPrice, 
      sizes, 
    };
  });*/

  /*const sizeRadios = [...document.querySelectorAll('input.swatches--radio')]
  const sizes = sizeRadios.map((sr) => {
    return sr.getAttribute('value');  //sr.textContent.trim();
  });*/

    /*const t = await page.$('h1.product-title');
  const p = await page.$('h5.product-price');
  const ps = await page.$('span.product-price--highlight');
  console.log('title --> ', t.toString());*/


  /*console.log('waistSection attrs --> ', JSON.stringify(waistSection.attributes));
        const wsJson = await waistSection.jsonValue();
        console.log('waistSection json --> ', wsJson);
        const wsProperties = await waistSection.getProperties();
        console.log('waistSection properties --> ', wsProperties);*/

  /*for(let c of colorRadioContainers) {
      console.log('container --> ', c);
      //console.log('container asElement --> ', c.asElement());
      console.log('container attrs --> ', JSON.stringify(c.attributes));

      const cJson = await c.jsonValue(); 
      console.log('container json --> ', cJson); 

      const cProps = await c.getProperties();
      console.log('container properties --> ', cProps);
    }; */

  /*const c = result.colors[4];
    console.log('\n \n ', c.colorName);
    c.sizes.forEach((size) => {
      console.log(size);
    });*/

  /* Sale List Logic */

  /*const p = await page.$('div.product-card');
  console.log('product --> ', p);
  console.log('product json --> ', await p.jsonValue());
  console.log('product string --> ', p.toString());
  console.log('product props --> ', await p.getProperties());*/



/* Basic Scrapers */

/*const scrapeSaleList = async (page) => {
  const salePageString = 'https://bananarepublic.gapcanada.ca/browse/category.do?cid=1014757'; 
  await page.goto(salePageString, {waitUntil: 'networkidle2'});

  const result = await page.evaluate(async () => {
    let anchors = []; // collect product links
    var hasNextPage; // track pagination

    do {
      // maybe add 'sleep' between iterations to avoid getting rate-limited

      // pagination logic
      const nextPage = document.querySelector("a.basic-pagination--button[title='next']");
      console.log('nextpage --> ', nextPage.className);
      for(let c of nextPage.classList) {
        console.log('class --> ', c);
      }
      hasNextPage = !nextPage.classList.contains('pagination-inactive');
      console.log('hasNextPage --> ', hasNextPage);

      // autoScrollPage logic
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
    
          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, 20);
      });

      // scraping logic
      const products = [...document.querySelectorAll('div.product-card')];
      console.log('# of products --> ', products.length);
      for(let p of products) {
        const anchor = p.querySelector('a');
        if(anchor) {
          console.log('product link --> ', anchor.href);
          anchors.push(anchor.href);
        }
      }

      //move to next page
      if(hasNextPage) {
        nextPage.click();
      }
    } while(hasNextPage);

    return anchors;
  });
  //console.log('result --> ', result);
  console.log('arr length --> ', result.length);
  return result; 
}

const scrapeProductPage = async (page, url) => {
  await page.goto(url);

  const result = await page.evaluate(() => {
    //try {
      // represents the product's name
      const title = document.querySelectorAll('h1.product-title')[0].textContent.trim();
      // represents the product's default price (usually full price unless all varieties are discounted)
      const stringPrice = document.querySelectorAll('h5.product-price')[0].textContent.trim();
      console.log('stringPrice --> ', stringPrice);
      const regex = /\d+\.\d+/;
      const numericPrice = Number.parseFloat(stringPrice.match(regex)[0]);
      console.log('numericPrice --> ', numericPrice);
      
      const priceString = document.querySelector('span.product-price--highlight').textContent.trim()
      console.log('\n priceString --> ', priceString);
      const isDiscounted = priceString.length > 0;
      console.log('\n isDiscounted --> ', isDiscounted);

      // represents all colors on the page
      let colors = [];

      // represents each section of colors (e.g. where each has its own specific price)
      const colorRadioContainers = [...document.querySelectorAll('div.swatch-price-group')];

      for(let container of colorRadioContainers) {
        // represents the element containing the discounted price
        const discountElement = container.querySelector('div.product-price__highlight');
        const discountedPrice = discountElement ? Number.parseFloat(discountElement.textContent.trim().match(regex)[0]) : null; 
        // represents the actual price of that specific color
        const currentPrice = discountedPrice || numericPrice;
        console.log('\n currentPrice --> ', currentPrice);

        // represents each 'color' radio button in the current container
        const colorRadios = [...container.querySelectorAll('input.swatch__radio')];

        // represents colors from the current container
        let interColors = [];
        for(let cr of colorRadios) {
          const colorName = cr.getAttribute('value');
          cr.click(); // selects color

          // stores sizes for a particular color
          let sizes = [];

          // represents possible sections
          const chestSection = document.getElementById('chest');
          const waistSection = document.getElementById('waist');
          const sizeSection = document.getElementById('size');

          console.log('waist --> ', waistSection);
          console.log('chest --> ', chestSection);
          console.log('size --> ', sizeSection);

          if(sizeSection) {
            console.log('size branch');
            // represents size buttons (e.g. S/M/L)
            const sizeRadios = [...sizeSection.querySelectorAll('input.swatches--radio')];
            for(let sr of sizeRadios) {
              const size = sr.getAttribute('value');
              const parent = sr.parentElement;  
              const oos = parent.querySelector('svg.swatch--outOfStockIndicator');
                
              if(oos) {
                continue;
              };

              console.log('size --> ', size);
              sizes.push(size);
            };

          } else if(waistSection) {
            console.log('waist branch');
            // represents waist size buttons
            const waistRadios = [...waistSection.querySelectorAll('input.swatches--radio')];
            for(let wr of waistRadios) {
              const waistSize = wr.getAttribute('value');
              wr.click();

              // represents length size buttons
              const lengthSection = document.getElementById('length');
              const lengthRadios = [...lengthSection.querySelectorAll('input.swatches--radio')]
              for(let lr of lengthRadios) {
                // represents parent of radio button (used to select sibling)
                const parent = lr.parentElement;
                // check for 'svg.outofstock'
                const oos = parent.querySelector('svg.swatch--outOfStockIndicator');
                
                if(oos) {
                  continue;
                };

                const lengthSize = lr.getAttribute('value');
                const size = waistSize + ' x ' + lengthSize;
                console.log('size --> ', size);
                sizes.push(size);
              };
            };

          } else if(chestSection) {
            console.log('chest branch');
            // represents chest size buttons
            const chestRadios = [...chestSection.querySelectorAll('input.swatches--radio')];
            for(let cr of chestRadios) {
              const chestSize = cr.getAttribute('value');
              cr.click();

              // represents length size buttons
              const lengthSection = document.getElementById('length');
              const lengthRadios = [...lengthSection.querySelectorAll('input.swatches--radio')]
              for(let lr of lengthRadios) {
                const parent = lr.parentElement;
                const oos = parent.querySelector('svg.swatch--outOfStockIndicator');
                
                if(oos) {
                  continue;
                };

                const lengthSize = lr.getAttribute('value');
                const size = chestSize + ' x ' + lengthSize;
                console.log('size --> ', size);
                sizes.push(size);
              };
            };

          } else {
            console.info('Unknown Product! Unable to parse!');
          }
    
          interColors.push({
            colorName,
            colorPrice: currentPrice, 
            sizes,
          });
        };

        // merges colors from current container with the page-wide color collection
        colors = [...colors, ...interColors];
      };

      return {
        title,
        // fullPrice: add this
        colors,  
      }; 
  });
  console.log('result --> ', result);
  return result;
}*/



/*const scrapeProduct = async (page, link, scraper) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  let link = 'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1146838&pcid=32643&vid=1&pid=488697003';
  let productData = await br.scrapeBananaProduct(page, link);
  console.log('productData --> ', productData);
  let product = {
    url: link, 
    name: productData.title, 
    pid: productData.pid, 
    pcid: productData.pcid, 
    priceHistory: [{
      date: Date.now(), 
      colors: productData.colors, 
    }],  
  };

  let newProduct = await ProductController.upsertProduct(product);
  console.log('newProduct --> ', newProduct);
}*/



/* Generic scrape func */
/*const scrape = async (page, links, scraper) => {
  // scrape price/colors/sizes from product pages
  for(let l of links) {
    await helpers.sleep(2500);
    let productData = await scraper(page, l);
    console.log('productData --> ', productData);
    let product = {
      url: link,
      name: productData.title,
      colors: productData.colors, 
      date: Date.now(), 
    };
    
    ProductController.findOne({pid: productData.pid}).exec((err, res) => {
      console.log('existingProduct --> ', res);

      // either create or update Product db entry
      if(res) {
        await ProductController.updateProduct(product);
      } else {
        await ProductController.createProduct(product);
      }
    });
  }
}*/



//scrapeProduct();

//testJcrew();
//test();
//scrapeBR();
//scrapeSaleList();
//scrapeProductPage();