
// extract id from URL like "https://stratz.com/heroes/2/matchups"
const extractIdFromString = (string) => {

}


// scrape URLs from sale page
const scrapeHeroes = async (page) => {
  const url = 'https://stratz.com/heroes';
  await page.goto(url);

  return await page.evaluate(async () => {
    const anchors = Array.from(document.querySelectorAll("div.hero-grid > a"));
    const urls = anchors.map((elem) => {
      return elem.getAttribute('href') + '/counters';
    })
    return urls;
  }); 
}

// scrape data from product page
const scrapeSynergies = async (page, id) => {
  await page.goto(`https://stratz.com/heroes/${id}/matchups`);

  let synergies = await page.evaluate(async () => {
    try {
      let synergies = [];

      //sleep
      await new Promise(r => setTimeout(r, 10000));

      // autoscroll
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

      let len = 0;
      let rows;
      do {
        await new Promise(r => setTimeout(r, 2000));
        rows = document.querySelectorAll("a.jHdIRk[href$='/matchups']");
        len = rows.length;
        console.log(len);
      } while(len < 122);

      for(let tr of rows) {
        console.log(tr);
        let cells = tr.querySelectorAll(":scope > div");
        let lastIndex = cells.length - 1;
        
        let regex = /[0-9]+/i;

        let href = tr.getAttribute('href');
        console.log(href);
        let ally = href.match(regex)[0];
        console.log(ally);
        
        let synergy = cells[lastIndex-1].querySelectorAll("div")[0].textContent;
        synergy = synergy.replace("%", "");
        synergy = synergy.replace("+", "");
        
        let withWinrate = cells[lastIndex-2].querySelectorAll("div")[0].textContent;
        withWinrate = withWinrate.replace("%", "");

        console.log(`${ally} -- ${synergy} -- ${withWinrate}`);

        synergies.push({
          ally,
          synergy,
          withWinrate, 
        });
      }
      return synergies; 
    } catch(err) {
      console.error(err);
      return err;
    }
  });


  return {
    id, 
    synergies,
  };
}

module.exports = {
  scrapeHeroes,
  scrapeSynergies, 
}
