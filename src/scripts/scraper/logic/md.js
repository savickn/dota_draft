
/* massimo dutti */

/* 
** a.card9-link --> link to product page
** img.card9-img --> thumbnail image
** div.card9-contents --> info about product (e.g. price/colors/size)... can .hover() to show sizes
**** ul.selector-sizes
****** button > span --> has size (e.g. S/M/L) unless 'button.disabled' (means out of stock)
**** a.pointer --> link to product page + name of product
**** span.old-price --> regular price
**** span.price --> sale price
**** button --> used to select colors
****** img --> color thumbnail
*/


/* issues:
** does not show sizes if screen size is too small
**
*/


// scrape URLs from sale page
const scrapeSale = async (page) => {
  const url = 'https://www.massimodutti.com/ca/men/sale/up-to--60%25-c1887163.html';

  return await page.evaluate(async () => {
    let anchors = []; // collect product links

                              /* autoScrollPage logic */

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
    const products = [...document.querySelectorAll('a.card9-link')];
    console.log('# of products --> ', products.length);
    for(let p of products) {
      const anchor = p.getAttribute('href');
      if(anchor) {
        console.log('product link --> ', anchor);
        anchors.push(anchor);
      }
    }

    return anchors;
  });
}

// scrape data from sale page... WORKING
const scrapeProducts = async (page) => {
  const url = 'https://www.massimodutti.com/ca/men/sale/up-to--60%25-c1887163.html';
  await page.goto(url, {waitUntil: 'networkidle2',  timeout: 0});

  return await page.evaluate(async () => {
    let products = []; 
    const priceRegex = /\d+\.\d+/;

                              /* autoScrollPage logic */

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

                              /* scraping logic */
    
    const elems = [...document.querySelectorAll('div.box-single')];

    for(let e of elems) {
      // basic info
      const title = e.querySelector('a.pointer').textContent.trim();
      console.log('title --> ', title);
      // how to get URL from here???
      
      const imageSrc = e.querySelector('img.card9-image').getAttribute('src');
      console.log('image --> ', imageSrc);

      const fullPriceString = e.querySelector('span.old-price').textContent.trim();
      console.log('fullPrice --> ', fullPriceString);
      const currentPriceString = e.querySelector('span.price').textContent.trim();
      console.log('currentPrice --> ', currentPriceString);

      const fullPrice = Number.parseFloat(fullPriceString.match(priceRegex)[0]);
      const currentPrice = Number.parseFloat(currentPriceString.match(priceRegex)[0]); 

      // filter thru colors
      const colorButtons = [...e.querySelectorAll('div.color-selector')];
      for(let c of colorButtons) {
        console.log(c);
        const colorName = c.parentElement.getAttribute('title');
        console.log('color --> ', colorName);
        const colorThumb = c.querySelector('img').getAttribute('src');
        console.log('colorImg --> ', colorThumb);
        c.click();

        // get sizes for each color
        const sizeContainer = e.querySelector('ul.selector-sizes');
        const sizeButtons = [...sizeContainer.querySelectorAll('button')];

        const sizes = [];

        for(let s of sizeButtons) {
          if(s.classList.contains('disabled')) continue;
          const size = s.querySelector('span').textContent.trim();
          console.log('size --> ', size);
          sizes.push(size);
        }

        const p = {
          name: title,
          brand: 'MD',
          imageSrc, 
          //pid,
          //pcid,
          
          fullPrice,
          currentPrice,
    
          color: colorName,
          colorSrc: colorThumb, 
    
          sizes,
        };

        console.log('product --> ', p);
        products.push(p);
      }
    }
    return products;
  });
}

module.exports = {
  scrapeSale,
  scrapeProducts, 
}



