
/* 
** Functions to analyze data scraped from clothing retailers (e.g. which 'pcid' for 'Sweaters/Blazers/etc')
*/

/* 
Categories:
* Shirt
* Dress Shirt
* Polo
* Jacket
* Henley
* Sweater
* Chino
* Pant
* Jean
* Blazer
* Suit Jacket
* Coat
* Parka 
*/

let categories = [
  'Shirt', // t-shirt, dress shirt, henley
  'Polo',
  'Jacket', 
  'Sweater', // crewneck, v-neck, turtleneck, mockneck, sweatshirt, hoodie
  
  
  
  'Chino', 
  'Pant', 
  'Jean', 




  'Cotton',
  'Wool',

  'Denim',
  'Corduroy',

];


export const analyzeKeywords = (txt) => {
  const keywords = txt.split(/-|\s/);
  //console.log('keywords --> ', keywords);

  // make entry into pcid-category map

  return keywords;
}



