
const puppeteer = require('puppeteer');
const path = require('path');
const util = require('util');

const scrapers = require('./scrape');
const br = require('./logic/br');
const gap = require('./logic/gap');
const jcrew = require('./logic/jcrew');
const md = require('./logic/md');

//const helpers = require('./logic/helpers');
const ProductController = require('../../server/api/Product/product.controller');


const testAll = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args:[
      '--start-maximized' // you can also use '--start-fullscreen'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900});


  await testMD(page);
  //await testBR(page);
  //await testGAP(page);
}

// NOT TESTED
const testMD = async (page) => {
  const products = await md.scrapeProducts(page);
  console.log(products);
  console.log('MD test end');
}


// WORKING
const testBR = async (page) => {
  const links = [
    //'https://bananarepublic.gap.com/browse/OutOfStockNoResults.do', // oos product
    //'https://bananarepublic.gapcanada.ca/browse/GeneralNoResults.do', // non-existent link
    'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1125294&pcid=1014757&vid=1&pid=215539013', // blazer (e.g. 40R/36S)
    //'https://bananarepublic.gapcanada.ca/browse/product.do?pid=512829003&cid=1091405&pcid=1014757&vid=1&grid=pds_3_558_1#pdp-page-content', // blazer
    'https://bananarepublic.gapcanada.ca/browse/product.do?pid=510241013&cid=1125294&pcid=1014757', // sweater
    'https://bananarepublic.gapcanada.ca/browse/product.do?pid=473206033&cid=1014857&pcid=1014757', // v-neck merino 
    
    'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1091405&pcid=1014757&vid=1&pid=674705003', // pants (e.g. 32x34)
    'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1091405&pcid=1014757&vid=1&pid=512628003', // shirts (e.g. S/M/L)
    //'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1146838&pcid=32643&vid=1&pid=488697003', // dress shirts (e.g. 15x36)
    //'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1146838&pcid=32643&vid=1&pid=488697003', // shoes (e.g. 9/12/etc)
  ];

  await scrapers.scrapeProduct(page, links, br.scrapeBananaProduct);
  console.log('BR test end');
}

// WORKING
const testGAP = async (page) => {
  const links = [
    //'https://www.gapcanada.ca/browse/OutOfStockNoResults.do', // oos product
    //'https://www.gapcanada.ca/browse/GeneralNoResults.do', // non-existent link
    //'https://www.gapcanada.ca/browse/product.do?cid=1150947&pcid=1150924&vid=1&pid=493135003', // pants (e.g. 32x34)
    'https://www.gapcanada.ca/browse/product.do?cid=1150942&pcid=1150924&vid=1&pid=492434003', // shirts (e.g. S/M/L)
  ];

  await scrapers.scrapeProduct(page, links, gap.scrapeGapProduct);
  console.log('GAP test end');
}





module.exports = {
  testAll, 
};


