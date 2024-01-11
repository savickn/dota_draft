
import _ from 'lodash';

import Hero from './hero.model';


/* used to add a hero */
export const addHero = (req, res) => {
  /* should perform validation of 'req.body' fields (e.g. must have Name/Email/Password) */
  
  let userObj = {};
  let newHero = _.merge(userObj, req.body);

  console.log('create hero --> ', newHero);

  Hero.create(newHero)
    .then(hero => res.status(201).json({ hero }))
    .catch(err => res.status(500).send(err));
};

// retrieve all heroes
export const getHeroes = (req, res) => {
  let search = JSON.parse(req.query.search);
  
  let query = {};
  if(search.text && search.text.length > 0) {
    const regex = new RegExp(`${search.text}`);
    query['localized_name'] = { $regex: regex, $options: 'i' };
  };

  Hero.find(query)
    .sort({'localized_name': 1})
      .then(heroes => {
        return res.status(200).json({ heroes });
      })
      .catch(err => res.status(500).send(err));
}

// get 1 hero
export const getHero = (req, res) => {
  Hero.findById(req.params.id)
    .then(hero => {
      console.log(hero);
      return res.status(200).json({ hero });
    })
    .catch(err => res.status(500).send(err));
};


export const updateHero = (req, res) => {
  let userObj = {};
  let newHero = _.merge(userObj, req.body);

  console.log('_id --> ', req.params.id);
  console.log('update hero --> ', newHero);

  console.log('body -- ', req.body);

  let updateObj = {
    $set: req.body,
  }

  console.log(updateObj);

  Hero.findOneAndUpdate(
      {'_id': req.params.id},
      updateObj,
      {upsert: true, new: true})
    .then(hero => res.status(203).json({hero}))
    .catch(err => res.status(500).send(err));

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
  Hero.findOneAndRemove({_id: req.params.id})
    .then(hero => res.status(200).end())
    .catch(err => res.status(500).send(err));
};
