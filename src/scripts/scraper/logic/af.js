
/* abercrombie */

/* 
** li.product-card--anf --> container for individual products
**** button.product-quickview__button --> can view available colors/sizes/etc
** div.product-quickview__content --> 
**** span.promo-badge --> contains sale info (e.g. extra 25% off)
** nav#grid-pagination --> handles pagination
*/


/* issues:

*/

// scrape everything from Sale page
const scrapeProducts = async (page) => {
  const url = 'https://www.abercrombie.com/shop/ca/mens-clearance';
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

                              /* pagination logic */

    dsfsdfsdf



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


