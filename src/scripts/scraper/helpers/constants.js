
export const getBASByName = (name) => {
  if(Object.keys(base_attack_speeds).includes(name)) {
    return base_attack_speeds[name]; 
  } else {
    return 100;
  }
}

export const base_attack_speeds = {
  'Centaur Warrunner': 90,
  'Shadow Shaman': 90,
  'Spectre': 90,
  'Tiny': 90,
  'Juggernaut': 110,
  'Lycan': 110,
  'Mirana': 110,
  'Naga Siren': 110,
  'Sand King': 110,
  'Sven': 110,
  'Terrorblade': 110,
  'Visage': 110,
  'Dark Willow': 115,
  'Lion': 115,
  'Storm Spirit': 115,
  'Venomancer': 115,
  'Abaddon': 120,
  'Lifestealer': 120,
  'Slark': 120,
  'Viper': 120,
  'Weaver': 120,
  'Broodmother': 125,
  'Gyrocopter': 125,
};


