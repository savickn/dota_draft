

const replaceAtIndex = (str, i, value) => {
  return str.substring(0, i) + value + str.substring(i + 1);
}


const scrapePositions = async (page, hero) => {
  await page.goto('https://dota2protracker.com/hero/'+ hero);

  return await page.evaluate(async () => {
    try {
      await new Promise(r => setTimeout(r, 4000));

      let roleStr = [0, 0, 0, 0, 0,];

      let tabs = Array.from(document.querySelectorAll('div.role-tabs > button'));
      let numberOfRoles = tabs.length;
      console.log(numberOfRoles);
      console.log(tabs);

      let beta = parseInt(100 / numberOfRoles);
      console.log(beta);

      let i = 1;
      while(i <= numberOfRoles) {
        let role = tabs[i-1].textContent.trim();
        console.log(role);

        let red = document.querySelector(`div.tabs-${i} div.header-role-info span.red`);
        let green = document.querySelector(`div.tabs-${i} div.header-role-info span.green`);
        
        console.log('red -- ', red);
        console.log('green -- ', green);

        let presence = red ? red.textContent.trim() : green.textContent.trim();
        console.log(presence.replace("%", ""));

        let percent = parseFloat(presence.replace("%", ""));
        if(role.match(/Carry/)) {
          roleStr[0] = beta;
        } else if(role.match(/Mid/)) {
          roleStr[1] = beta;
        } else if(role.match(/Offlane/)) {
          roleStr[2] = beta;
        } else if(role.match(/Support \(4\)/)) {
          roleStr[3] = beta;
        } else if(role.match(/Support \(5\)/)) {
          roleStr[4] = beta;
        }

        i++;
      }

      console.log(roleStr);
      return roleStr;
    } catch(e) {
      console.log(e);
    }
  });
}


module.exports = {
  scrapePositions, 
}


/*
      const replaceAtIndex = (str, i, value) => {
        return str.substring(0, i) + value + str.substring(i + 1);
      }

if(percent > 10){
          if(role.match(/Carry/)) {
            roleStr = replaceAtIndex(roleStr, 0, "1");
          } else if(role.match(/Mid/)) {
            roleStr = replaceAtIndex(roleStr, 1, "1");
          } else if(role.match(/Offlane/)) {
            roleStr = replaceAtIndex(roleStr, 2, "1");
          } else if(role.match(/Support \(4\)/)) {
            roleStr = replaceAtIndex(roleStr, 3, "1");
          } else if(role.match(/Support \(5\)/)) {
            roleStr = replaceAtIndex(roleStr, 4, "1");
          }
        }
        */