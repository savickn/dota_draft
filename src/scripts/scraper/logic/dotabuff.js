
// scrape URLs from sale page
const scrapeHeroes = async (page) => {
  const url = "https://www.dotabuff.com/heroes";
  await page.goto(url);

  return await page.evaluate(async () => {
    const anchors = document.querySelectorAll("div.hero-grid > a");
    const urls = anchors.map((elem) => {
      return elem.getAttribute('href') + '/counters';
    })
    return urls;
  });
}

// scrape data from product page
const scrapeMatchups = async (page, url) => {
  await page.goto(url);

  return await page.evaluate(() => {
    try {

      let res = {};
      
      let rows = document.querySelectorAll("table.sortable > tbody > tr");
      console.log(rows.length);     
      
      for(let tr of rows) {
        let cells = tr.querySelectorAll('td');

        let name = cells[1].getAttribute('data-value');
        let disadvantage = cells[2].getAttribute('data-value');
        let winrate = cells[3].getAttribute('data-value');

        console.log(`${name} -- ${disadvantage} -- ${winrate}`);

        res[name] = {
          disadvantage,
          winrate, 
        };
      }
      console.log(res);
      return res;
    } catch(err) {
      console.error(err);
      return err;
    }
  });
}

module.exports = {
  scrapeHeroes,
  scrapeMatchups, 
}
