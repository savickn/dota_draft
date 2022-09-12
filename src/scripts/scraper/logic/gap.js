

const scrapeGapProduct = async (page, url) => {
  await page.goto(url);

  const result = await page.evaluate(() => {
    try {

      const url = document.location.href;
      const urlParams = new URLSearchParams(window.location.search);

      const pid = urlParams.get('pid');
      const pcid = urlParams.get('pcid');

      // represents the product's name
      const title = document.querySelectorAll('h1.product-title')[0].textContent.trim();
      // represents the product's default price (usually full price unless all varieties are discounted)
      const stringPrice = document.querySelectorAll('h5.product-price')[0].textContent.trim();
      console.log('stringPrice --> ', stringPrice);
      const regex = /\d+\.\d+/;
      const numericPrice = Number.parseFloat(stringPrice.match(regex)[0]);
      console.log('numericPrice --> ', numericPrice);
      
      /*const priceString = document.querySelector('span.product-price--highlight').textContent.trim()
      console.log('\n priceString --> ', priceString);
      const isDiscounted = priceString.length > 0;
      console.log('\n isDiscounted --> ', isDiscounted);*/

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
        pid, 
        pcid, 
        brand: 'GAP', 
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

const scrapeGapSale = async (page) => {
  const salePageString = 'https://www.gapcanada.ca/browse/category.do?cid=1065870&mlink=homepage,,flyout_men_Men_s_Sale&departmentRedirect=true#pageId=0&department=75'; 
  await page.goto(salePageString, {waitUntil: 'networkidle2'});

  const result = await page.evaluate(async () => {
    let anchors = []; // collect product links
    let hasNextPage; // track pagination

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
      const products = [...document.querySelectorAll('a.certona__product-card__anchor')];
      console.log('# of products --> ', products.length);
      anchors = products.map((p) => {
        const href = p.getAttribute('href');
        console.log('product link --> ', href);
        return href;
      })

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


module.exports = {
  scrapeGapSale, 
  scrapeGapProduct, 
}