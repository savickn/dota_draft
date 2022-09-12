
//const helpers = require('./helpers');

// scrape URLs from sale page
const scrapeBananaSale = async (page) => {
  console.log('dfsdf');

  return await page.evaluate(async () => {

    let anchors = []; // collect product links
    let hasNextPage; // track pagination

    do {
      // maybe add 'sleep' between iterations to avoid getting rate-limited
      //await helpers.sleep(1000); // not working
      //await setTimeout(() => {}, 2000);

      // pagination logic
      const nextPage = document.querySelector("button[aria-label='Next Page']");
      console.log('nextPage --> ', nextPage);

      if(nextPage) {
        hasNextPage = !nextPage.classList.contains('pagination-inactive');
      } else {
        hasNextPage = false;
      }
      console.log('hasNextPage --> ', hasNextPage);

      // autoScrollPage logic
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 80;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
    
          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, 35);
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
}

// scrape data from product page
const scrapeBananaProduct = async (page, pageUrl) => {
  await page.goto(pageUrl);

  const result = await page.evaluate(() => {
    try {
      // represents all colors on the page as individual Products
      let colors = [];

      const url = new URL(document.location.href);
      const urlParams = new URLSearchParams(window.location.search);

      // handle redirect to OutOfStock page
      // if(url === 'https://bananarepublic.gap.com/browse/OutOfStockNoResults.do') {
      //   return [{
      //     url: pageUrl,
      //     outOfStock: true, 
      //   }];
      // }

      const origin = url.origin;

      const pid = urlParams.get('pid');
      const pcid = urlParams.get('pcid');

      const title = document.querySelector('h1.product-title__text').textContent.trim(); // product name
      
      // determine full price
      let priceString = '';
      const regex = /\d+\.\d+/;

      const regularPrice = document.querySelector('span.product-price--pdp__regular');
      const fullPrice = document.querySelector('h2.product-price--pdp');
      const strikePrice = document.querySelector('span.product-price__strike');

      if(regularPrice) { priceString = regularPrice.textContent.trim() };
      if(fullPrice) { priceString = fullPrice.textContent.trim() };
      if(strikePrice) { priceString = fullPrice.textContent.trim() };

      console.log('priceString --> ', priceString);
      const numericPrice = Number.parseFloat(priceString.match(regex)[0]); // product price as Number
      console.log('numericPrice --> ', numericPrice);

      // represents each section of colors (e.g. where each has its own specific price)
      const colorRadioContainers = [...document.querySelectorAll('div.swatch-price-group')];

      for(let container of colorRadioContainers) {
        console.log('color container --> ', container);

        // determine discount price
        let discountPrice = null;
        const priceInTitle = document.querySelector('h2.product-price--pdp__highlight');
        const priceInContainer = container.querySelector('div.product-price__highlight');

        if(priceInTitle) { discountPrice = Number.parseFloat(priceInTitle.textContent.trim().match(regex)[0]); }
        if(priceInContainer) { discountPrice = Number.parseFloat(priceInContainer.textContent.trim().match(regex)[0]); }

        const currentPrice = discountPrice || numericPrice; // final price of color
        console.log('\n currentPrice --> ', currentPrice);

        // represents each 'color' radio button in the current container
        const colorRadios = [...container.querySelectorAll('input.swatch__radio')];

        // represents colors from the current container
        let interColors = [];
        for(let cr of colorRadios) {
          const colorName = cr.getAttribute('value');
          console.log('colorName --> ', colorName);
          const colorThumb = cr.parentElement.querySelector('img.swatch__image').getAttribute('src');
          console.log('colorThumb --> ', colorThumb);
          cr.click(); // selects color

          // get stock image for product
          //const colorImage = [...document.querySelectorAll('img.pagination__product-image')][0].getAttribute('src');
          const colorImage = document.querySelector('img.pdp-in-place-zoom-image').getAttribute('src');
          console.log('colorImg --> ', colorImage);

          // stores sizes for a particular color
          let sizes = [];

          //const sizeSections = [...document.querySelectorAll('div[role="radiogroup"]')];
          //const sizeSections = [...document.querySelectorAll('div.swatches_dimension')];
          const sizeSections = [...document.querySelectorAll('div.dimensions-group')];
          console.log('sizeSections --> ', sizeSections);

          const primarySize = sizeSections[0];
          const secondarySize = sizeSections.length > 1 ? sizeSections[1] : null;

          const primaryRadios = [...primarySize.querySelectorAll("input[type='radio']")];

          for(let pr of primaryRadios) {
            const primarySize = pr.getAttribute('value');
            const pParent = pr.parentElement;  
            const oos = pParent.querySelector('svg');
              
            if(oos) {
              continue;
            };

            if(secondarySize) {
              const secondaryRadios = [...secondarySize.querySelectorAll("input[type='radio']")];
              for(let sr of secondaryRadios) {
                const secondarySize = sr.getAttribute('value');
                const sParent = sr.parentElement;  
                const oos = sParent.querySelector('svg');
                  
                if(oos) {
                  continue;
                };

                const size = primarySize + ' x ' + secondarySize;
                sizes.push(size);
              }
            } else {
              sizes.push(primarySize);
            }
          }
    
          interColors.push({
            name: title,
            pid,
            pcid,
            brand: 'BR',
            
            fullPrice: numericPrice,
            currentPrice,

            color: colorName,

            imageSrc: origin + colorImage, 
            colorSrc: colorThumb, 

            sizes,
          });
        };

        // merges colors from current container with the page-wide color collection
        colors = [...colors, ...interColors];
      };

      /*return {
        title,
        pid, 
        pcid, 
        brand: 'BR', 
        //category: 
        // fullPrice: add this
        colors,  
      }; */
      console.log(colors);
      return colors;
    } catch(err) {
      console.error(err);
      return err;
    }
  });
  
  console.log(result);
  return result;
}

module.exports = {
  scrapeBananaSale,
  scrapeBananaProduct, 
}


/*

  let salePageString = '';
  
  const gapString = 'https://www.gapcanada.ca/browse/category.do?cid=1065870&mlink=homepage,,flyout_men_Men_s_Sale&departmentRedirect=true#pageId=0&department=75';
  const onString = 'https://oldnavy.gapcanada.ca/browse/category.do?cid=26061&mlink=11174,13518818,flyout_m_SALE&clink=13518818';
  const brString = 'https://bananarepublic.gapcanada.ca/browse/category.do?cid=1014757&sop=true';
  
  switch(site) {
    case 'GAP':
      salePageString = gapString;
      break;
    case 'BR':
      salePageString = brString;
      break;
    case 'ON':
      salePageString = onString;
      break;
    default:
      throw new Error('Invalid site!');
  }

  await page.goto(salePageString, {waitUntil: 'networkidle2',  timeout: 0});
  */



/*
const scrapeBananaProduct = async (page, url) => {
  await page.goto(url);

  const result = await page.evaluate(() => {
    try {

      const url = document.location.href;
      const urlParams = new URLSearchParams(window.location.search);

      const pid = urlParams.get('pid');
      const pcid = urlParams.get('pcid');

      const title = document.querySelectorAll('h1.product-title__text')[0].textContent.trim(); // product name
      const stringPrice = document.querySelectorAll('span.product-price__strike')[0].textContent.trim(); // represents the product's default price (usually full price unless all varieties are discounted)
      console.log('stringPrice --> ', stringPrice);
      const regex = /\d+\.\d+/;
      const numericPrice = Number.parseFloat(stringPrice.match(regex)[0]); // product price as Number
      console.log('numericPrice --> ', numericPrice);

      // represents all colors on the page
      let colors = [];

      // represents each section of colors (e.g. where each has its own specific price)
      const colorRadioContainers = [...document.querySelectorAll('div.swatch-price-group')];

      for(let container of colorRadioContainers) {
        // represents the element containing the discounted price
        const discountElement = container.querySelector('h2.product-price--pdp__highlight');
        const discountedPrice = discountElement ? Number.parseFloat(discountElement.textContent.trim().match(regex)[0]) : null; 
        // represents the actual price of that specific color
        const currentPrice = discountedPrice || numericPrice;
        console.log('\n currentPrice --> ', currentPrice);

        // represents each 'color' radio button in the current container
        const colorRadios = [...container.querySelectorAll('img.swatch__image')];

        // represents colors from the current container
        let interColors = [];
        for(let cr of colorRadios) {
          const colorName = cr.getAttribute('alt');
          cr.click(); // selects color

          // get stock image for product
          const colorImage = document.querySelectorAll('pagination__product-image')[0].getAttribute('src');

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
            colorImage, 
            colorPrice: currentPrice, 
            sizes,
          });
        };

        // merges colors from current container with the page-wide color collection
        colors = [...colors, ...interColors];
      };

      return {
        title,
        pid, 
        pcid, 
        brand: 'BR', 
        //category: 
        // fullPrice: add this
        colors,  
      }; 
    } catch(err) {
      console.error(err);
      return err;
    }
  });
  return result;
}
*/


/* OLD


const scrapeBananaSale = async (page, site) => {
  let salePageString = '';
  
  const gapString = 'https://www.gapcanada.ca/browse/category.do?cid=1065870&mlink=homepage,,flyout_men_Men_s_Sale&departmentRedirect=true#pageId=0&department=75';
  const onString = 'https://oldnavy.gapcanada.ca/browse/category.do?cid=26061&mlink=11174,13518818,flyout_m_SALE&clink=13518818';
  const brString = 'https://bananarepublic.gapcanada.ca/browse/category.do?cid=1014757&sop=true';
  
  switch(site) {
    case 'GAP':
      salePageString = gapString;
      break;
    case 'BR':
      salePageString = brString;
      break;
    case 'ON':
      salePageString = onString;
      break;
    default:
      throw new Error('Invalid site!');
  }

  await page.goto(salePageString, {waitUntil: 'load' ,  timeout: 0});

  const result = await page.evaluate(async (helpers) => {
    console.log('helpers --> ', helpers);

    let anchors = []; // collect product links
    var hasNextPage; // track pagination

    do {
      // maybe add 'sleep' between iterations to avoid getting rate-limited
      //await helpers.sleep(1000); // not working

      // pagination logic
      const nextPage = document.querySelector("a.basic-pagination--button[title='next']");
      //console.log('nextpage --> ', nextPage.className);
      for(let c of nextPage.classList) {
        console.log('class --> ', c);
      }
      hasNextPage = !nextPage.classList.contains('pagination-inactive');
      console.log('hasNextPage --> ', hasNextPage);

      // autoScrollPage logic
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 80;
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
  }, helpers);
  console.log('result --> ', result);
  console.log('arr length --> ', result.length);
  retu

*/