
const puppeteer = require('puppeteer');

const jcrew = require('../logic/jcrew');
const br = require('../logic/br');
const gap = require('../logic/gap');

// working
const testJcrew = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));

  const testJcrewShirt = 'https://www.jcrew.com/ca/p/mens_category/sweaters/pullover/cotton-crewneck-sweater-in-garter-stitch/H6060?bmUID=mJIo.G.&bmLocale=en_CA';
  const testJcrewShoes = 'https://www.jcrew.com/ca/p/mens_category/shoes_sneakers/oxford/oar-stripe-italian-leather-derbys/J8989?sale=true&isFromSale=true&color_name=burnished-sienna';
  const testJcrewPants = 'https://www.jcrew.com/ca/p/mens_category/denim_jeans/straight770/770-straightfit-stretch-jean-in-dark-evening-wash/J5233?sale=true&isFromSale=true&color_name=dark-evening-wash';

  await jcrew.scrapeJcrewSale(page);
  await jcrew.scrapeJcrewProduct(page, testJcrewShirt);
  await jcrew.scrapeJcrewProduct(page, testJcrewShoes); 
  await jcrew.scrapeJcrewProduct(page, testJcrewPants); 

  await browser.close();
};

// working
const testBR = async (headless = false) => {
  const browser = await puppeteer.launch({headless});
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));

  const testBRShirt = 'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1106843&pcid=44866&vid=1&pid=491189003';
  const testBRBlazer = 'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1146838&pcid=32643&vid=1&pid=488697003';
  const testBRShorts = 'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1112260&pcid=1020051&vid=1&pid=320592033';
  const testBRPants = 'https://bananarepublic.gapcanada.ca/browse/product.do?cid=1135879&pcid=35878&vid=1&pid=795221393';

  await br.scrapeBananaSale(page, 'BR');
  //await br.scrapeBananaProduct(page, testBRShirt); // working on BR
  //await br.scrapeBananaProduct(page, testBRBlazer); // working on BR
  //await br.scrapeBananaProduct(page, testBRShorts); // mostly working on BR (except full price products)
  //await br.scrapeBananaProduct(page, testBRPants); // working on BR

  await browser.close();
};

// working
const testGap = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));

  const testGapShirt = 'https://www.gapcanada.ca/browse/product.do?pid=443681003&rrec=true&mlink=5050,12413545,GAPcategory1_rr_1&clink=12413545';
  const testGapPants = 'https://www.gapcanada.ca/browse/product.do?cid=1063638&pcid=1065870&vid=1&pid=320802083';

  await br.scrapeBananaSale(page, 'GAP');
  await br.scrapeBananaProduct(page, testGapShirt); 
  await br.scrapeBananaProduct(page, testGapPants); 

  await browser.close();
};

testBR();
//testGap();
//testJcrew();

