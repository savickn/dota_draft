
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
  disadvantage: {
    type: String,
    required: true
  }, 
  vsWinrate: {
    type: String,
    required: true
  }
});


const DotabuffSchema = new Schema({
  hero: {
    type: String,
    required: true
  }, 
  winrate: {
    type: String,
    required: true
  }, 
  matchups: [MatchupSchema],

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

DotabuffSchema.set('toJSON',  { virtuals: true });

export default mongoose.model('Dotabuff', DotabuffSchema);
