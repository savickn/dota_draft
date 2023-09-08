
const axios = require('axios').default;

const scrapeStats = async () => {
  try {
    let res = await axios.get('https://api.opendota.com/api/constants/heroes');
    return res.data;
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  scrapeStats, 
}
