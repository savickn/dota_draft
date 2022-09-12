
export const binaryFeatures = [

  // control
  "Stun (unreliable)", 
  "Stun (instant)", 
  "Root", 
  "Slow", 
  "Fear", 
  "Taunt", 
  "Leash", 

  // utility
  "Cancel", // for canceling TPs

  "Silence", 
  "Mute", 
  "Break", 
  "Damage Reduction", 
  "Damage Amp", 
  "% Damage",
  "Disarm", 
  "Blind", 
  "Ethereal",
  "Minus Armor",
  "BKB Piercing",
  "Save", // also includes "Banish",
  "Heal", // sustain
  "Mana Burn",
  "Forced Movement (e.g. hook)", // basically displace someone
  "Trap (e.g. cogs, arena)", // basically hinder movement
  "Dispel",
  "Purge",
  "Reach", // for jumping backline heroes
  "Invisibility", 
  "Spell Immunity", 

  // misc
  "Summons",

  "Multiple Damage Instances", // e.g. fast attack speed, DOT

];

// 
export const scalingFeatures = [
  "Magic Damage",
  "Physical Damage", // need to figure out DPS ranges (e.g. low = 500, high = 2000)

  "Physical Resistance", // armor
  "Magical Resistance", // 

  "Lane Strength", //

  "Burst", // burst damage
  "Mobility", // for avoiding/escaping heroes + split-pushing
  "Tankiness", // health ... good against BURST
  "Sustain", // heal/regen/etc ... good against DOT
];


// objective-based 
export const teamFeatures = [
  'Initiation', // 
  'Vision', // 
  'Waveclear', //

  'Roshan', // 
  'Tower-Taking', // 

  'Damage - Early', // 10-30 mins 
  'Damage - Late', // 30+ mins
  
  'Teamfight', // whether play with team or solo
  'Pickoff', // 
  'Pace', // speed of gameplay
];




export const strengths = [
  "Melee",
  "Ranged", 
  "int",
  "str",
  "agi", 
];


export const weaknesses = [
  "Stun (unreliable)",
  "Stun (instant)",
  "Root",
  "Slow",
  "Fear",
  "Taunt",
  "Leash",

  "Silence",
  "Mute",
  "BKB Piercing",
  "Evasion", 
  "Mana Burn",
  "Forced Movement (e.g. hook)", // basically displace someone
  "Trap (e.g. cogs, arena)", // basically hinder movement
  
  "Save", // should it include Dispel ???  Ethereal ???
  "Dispel",

  "Disarm", // includes "Disarm", "Blind", "Ethereal",

  "Purge", // has strong buff that can be purged
  "Break", // has strong passive
  
  "Summons",

  "Magic Damage", // same as not tanky
  "Physical Damage", // need to figure out DPS ranges (e.g. low = 500, high = 2000)
  
  "Reach", // for jumping backline heroes

  "Burst -- Physical",
  "Burst -- Magical", 

  "Multiple Damage Instances", // e.g. fast attack speed, DOT

  "Mobility",
  "Tankiness", // health

  "Low Cooldowns",
  "Fast Tempo", //
];

export const synergies = [
  "Vision",
  "Setup", // stun/root/taunt/leash/
  "Save", 
  "Initiation",
  "Damage", 



];







