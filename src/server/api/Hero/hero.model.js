
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// strength/weakness schema 
/*
feature: String,
multiplier: Number,
sign: positive or negative
*/


const MatchupSchema = new Schema({
  enemy: {
    type: String,
    required: true
  },
  disadvantage: { // hero disadvantage vs enemy
    type: String,
    required: true
  }, 
  vsWinrate: { // hero winrate vs enemy
    type: String,
    required: true
  }
});


const SynergySchema = new Schema({
  ally: {
    type: String,
    required: true
  },
  synergy: {
    type: String,
    required: true
  }, 
  withWinrate: {
    type: String,
    required: true
  }
});



const HeroSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  localized_name: {
    type: String,
    required: true
  },
  attr: {
    type: String,
    enum: ["str", "agi", "int"],
    required: true,
  },
  attack_type: {
    type: String,
    enum: ["Melee", "Ranged"],
    required: true,
  },
  imgString: {
    type: String, 
  },
  // other base stats
  position: { // for each position either 1 is valid or 0 if not valid
    type: String, 
    default: "11111"
  },
  
  utilities: [Schema.Types.Mixed], // e.g. stuns, silences, etc
  stats: [Schema.Types.Mixed],
  contributions: [Schema.Types.Mixed], // team-based stats

  strengths: [Schema.Types.Mixed], 
  weaknesses: [Schema.Types.Mixed], // bad against
  synergies: [Schema.Types.Mixed], // good with
  
  counters: [{
    type: String, // ???
  }],
  items: [{
    type: String, // ???
  }],
  hero_counters: [{
    type: String, // winrate-based
  }],
  item_counters: [{
    type: String, // ???
  }],

  winrate: {
    type: String,
    required: true
  }, 
  matchups: [MatchupSchema],
  synergies: [SynergySchema], 

  // counters --> which heroes this hero counters (and why... e.g. items or talents)
  // items --> which items this hero buys
  // item counters --> items that COUNTER this hero
  // hero counters --> heroes that COUNTER this hero

  textWeaknesses: [{ // description of hero's weaknesses
    type: String,
  }],
  textStrengths: [{ // description of hero's strengths
    type: String,
  }]

});

/**
 * Validations
 */


/**
 * PRE and POST Hooks
 */


/**
 * Instance Methods
 */


/**
 * Virtual Methods
 */

HeroSchema.set('toJSON',  { virtuals: true });

export default mongoose.model('Hero', HeroSchema);
