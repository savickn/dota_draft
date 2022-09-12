
import _ from 'lodash';

import Hero from './hero.model';


/* used to add a hero */
export const addHero = (req, res) => {
  /* should perform validation of 'req.body' fields (e.g. must have Name/Email/Password) */
  
  let userObj = {};
  let newHero = _.merge(userObj, req.body);

  console.log('create hero --> ', newHero);

  Hero.create(newHero, function(err, hero) {
    if (err) { return res.status(500).send(err); };
    return res.status(201).json({ hero });
  });
};

// retrieve all heroes
export const getHeroes = (req, res) => {
  let search = JSON.parse(req.query.search);
  
  let query = {};
  if(search.text && search.text.length > 0) {
    const regex = new RegExp(`${search.text}`);
    query['localized_name'] = { $regex: regex, $options: 'i' };
  };
  console.log('getHeroes --> ', query);

  Hero.find(query, function(err, heroes) {
    if (err) { return res.status(500).send(err); };
    console.log('heroes --> ', heroes.length);
    return res.status(200).json({ heroes });
  });
}

// get 1 hero
export const getHero = (req, res) => {
  Hero.findById(req.params.id, function(err, hero) {
    if (err) { return res.status(500).send(err); };
    console.log(hero);
    return res.status(200).json({ hero });
  });
};


export const updateHero = (req, res) => {
  let userObj = {};
  let newHero = _.merge(userObj, req.body);

  console.log('_id --> ', req.params.id);
  console.log('update hero --> ', newHero);

  Hero.findOneAndUpdate(
    {'_id': req.params.id},
    newHero,
    {upsert: true, new: true},
    function (err, hero) {
      if(err) return res.status(500).send(err);
      return res.status(203).json({hero});
    }
  );

  /*Hero.findById(req.params.id, function(err, hero) {
    if(err) return res.status(500).send(err);
    hero.overwrite(newHero);
    hero.save(function(err, hero) {
      if(err) return res.status(500).send(err);
      return res.status(203).json({hero});
    });
  });*/
};


// used to delete a hero
export const deleteHero = (req, res) => {
  Hero.findOneAndRemove({_id: req.params.id}, function(err, hero) {
    if (err) return res.status(500).send(err);
    return res.status(200).end();
  });
};
