
// scrape URLs from sale page
const scrapeHeroes = async (page) => {
  const url = "https://www.dotabuff.com/heroes";
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
const scrapeMatchups = async (page, url) => {
  await page.goto('https://www.dotabuff.com' + url);

  return await page.evaluate(() => {
    try {
      let matchups = [];

      // isolate hero name
      let h1 = document.querySelector("h1").textContent;
      let small = document.querySelector("h1 > small").textContent;
      let hero = h1.replace(small, "");
      
      // isolate winrate
      let lost = document.querySelector("span.lost");
      let won = document.querySelector("span.won");
      let winrateElem = lost === null ? won : lost;
      let winrate = winrateElem.textContent.replace("%", "");
      
      console.log(hero);
      console.log(winrate);

      let rows = document.querySelectorAll("table.sortable > tbody > tr");
      //console.log(rows.length);
      
      for(let tr of rows) {
        let cells = tr.querySelectorAll('td');

        let enemy = cells[1].getAttribute('data-value');
        let disadvantage = cells[2].getAttribute('data-value');
        let vsWinrate = cells[3].getAttribute('data-value');

        console.log(`${enemy} -- ${disadvantage} -- ${vsWinrate}`);

        matchups.push({
          enemy,
          disadvantage,
          vsWinrate, 
        });
      }
      return {
        hero,
        winrate, 
        matchups, 
      };
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
