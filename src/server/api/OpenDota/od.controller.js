
import axios from 'axios';

// get all hero attributes
export const getHeroes = (req, res) => {
  let url = 'https://api.opendota.com/api/constants/heroes';
  return axios.get(url)
    .then(function (response) {
      return res.status(200).json({heroes: response.data});
    })
    .catch(function (error) {
      console.log(error);
      return res.status(501).send(err);
    })
}

// get all items
export const getItems = (req, res) => {
  let url = 'https://api.opendota.com/api/constants/items';
  return axios.get(url)
    .then(function (response) {
      return res.status(200).json({ items: response.data });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(501).send(err);
    })
}

// get all abilities
export const getAbilities = (req, res) => {
  let url = 'https://api.opendota.com/api/constants/abilities';
  return axios.get(url)
    .then(function (response) {
      return res.status(200).json({ abilities: response.data });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(501).send(err);
    })
}


// get items for specific hero
export const getPopularItems = (req, res) => {
  let url = `https://api.opendota.com/api/heroes/${req.params.id}/itemPopularity`;
  return axios.get(url)
    .then(function (response) {
      console.log(response.data);
      return res.status(200).json({ heroItems: response.data });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(501).send(err);
    })
}

// get matchups for specific hero
export const getMatchups = (req, res) => {
  let url = `https://api.opendota.com/api/heroes/${req.params.id}/matchups`;
  return axios.get(url)
    .then(function (response) {
      return res.status(200).json({ heroMatchups: response.data });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(501).send(err);
    })
}







