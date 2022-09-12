

// used to scrape size and price info from product page
const scrapeJcrewProduct = async (page, url) => {
  await page.goto(url);

  const result = await page.evaluate(() => {
    const regex = /\d+\.\d+/;

    const title = document.querySelector('h1.product__name').innerText;
    const priceString = document.querySelector('span.product__price--list').innerText;
    const fullPrice = Number.parseFloat(priceString.match(regex)[0]);

    console.log('title --> ', title);
    console.log('priceString --> ', priceString);
    console.log('fullPrice --> ', fullPrice);

    // represents all colors on the page
    let colors = [];

    // represents each section of colors (e.g. where each has its own specific price)
    const colorRadioContainers = [...document.querySelectorAll('div.product__group')];

    for(let container of colorRadioContainers) {
      // represents the element containing the discounted price
      const saleString = container.querySelector('span.product__price').innerText;
      const salePrice = saleString ? Number.parseFloat(saleString.match(regex)[0]) : null; 
      console.log('salePrice --> ', salePrice);
      // represents the actual price of that specific color
      const currentPrice = salePrice || fullPrice;
      console.log('currentPrice --> ', currentPrice);

      // represents each 'color' radio button in the current container
      const colorRadios = [...container.querySelectorAll('div.js-product__color')];

      // represents colors from the current container
      let interimColors = [];
      for(let cr of colorRadios) {
        const colorName = cr.getAttribute('data-name');
        cr.click(); // selects color

        // stores sizes for a particular color
        let sizes = [];

        // container for size buttons
        const sizeSection = document.querySelector('div.sizes-list');
        const sizeRadios = [...sizeSection.querySelectorAll('div.js-product__size')];

        for(let sr of sizeRadios) {
          if(!sr.classList.contains('is-unavailable')) {
            sizes.push(sr.getAttribute('data-name'));
          }
        }
    
        interimColors.push({
          colorName,
          colorPrice: currentPrice, 
          sizes,
        });
      };

      // merges colors from current container with the page-wide color collection
      colors = [...colors, ...interimColors];
    };

    return {
      title,
      // fullPrice: add this
      colors,  
    }; 
  });
  console.log('result --> ', result);

  /*let test = result.colors[1];
  console.log(test.colorName);
  console.log(test.colorPrice);
  for(let t of test.sizes) {
    console.log(t);
  }*/

  return result;
}

/* 
** used to scrape links from sale page
*/ 
const scrapeJcrewSale = async (page) => {
  const baseUrl = 'https://www.jcrew.com';
  const salePageString = 'https://www.jcrew.com/ca/r/sale/men?Npge=';

  let productUrls = [];

  // used to track when to end the loop
  let pageCount = null;
  let currentPage = 1;

  do {
    await setTimeout(() => {}, 2000);

    const url = salePageString + currentPage;
    await page.goto(url, {waitUntil: 'networkidle2'});
    
    const result = await page.evaluate(async () => {
      let anchors = []; // collect product links
      let pageCountElem = document.querySelector('div.pagination__item').children[1].innerText;
      console.log('pageCountText --> ', pageCountElem);
      let pageCount = Number.parseInt(pageCountElem.match(/\d+/));
      console.log('pageCount --> ', pageCount);
  
      // maybe add 'sleep' between iterations to avoid getting rate-limited
  
      // scraping links
      const products = [...document.querySelectorAll('div.product-tile--info')];
      console.log('# of products --> ', products.length);
  
      let links = [];
      for(let p of products) {
        links.push(p.querySelector('a.product-tile__link'));
      }
  
      for(let l of links) {
        //console.log('product link --> ', l.href);
        anchors.push(l.href);
      }
      return {
        pageCount,
        anchors, 
      };
    });

    //console.log('result --> ', result);
    console.log('arr length --> ', result.anchors.length);
    
    // pagination tracking
    pageCount = result.pageCount || 1;
    currentPage++;

    // update product URLs
    productUrls = [...productUrls, ...result.anchors];
  } while(currentPage <= pageCount);

  console.log('productUrls.length --> ', productUrls.length);
  console.log('productUrls --> ', productUrls);
  return productUrls;
};

module.exports = {
  scrapeJcrewSale, 
  scrapeJcrewProduct, 
};

/* Sale Scraping */

/*const links = [...document.querySelectorAll('a.product-tile__link')];
    console.log('# of links --> ', links.length);*/

      // iterate through paginations
      /*for(let n = 1; n <= pageCount; n++) {
        let url = baseUrl + pageCount.toString();
        await page.goto(salePageString, {waitUntil: 'networkidle2'});
      }*/


