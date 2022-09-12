
import _ from 'lodash';

// accepts an Array of Mongoose objects (or sometimes an Array of ObjectIds) and an ObjectId 
export const matchByObjectId = (arr, id) => {
  console.log('matchbyid --> ', arr, id);
  for(let x of arr) {
    if(id === x || id === x._id) {
      return true;
    }
  }
  return false;
}

// accepts an Array of Mongoose objects and an updated Mongoose object
export const updateByObjectId = (arr, newElem) => {
  return arr.map((elem) => {
    if(!elem._id || !newElem._id) { console.log('updateByObjectId --> ObjectId missing!') };
    return elem._id === newElem._id ? newElem : elem;
  });
}

// accepts an Array of Mongoose objects and an ObjectId
export const removeByObjectId = (arr, id) => {
  return arr.filter(elem => elem._id !== id);
}

// used to merge two arrays without duplicates, WORKING WELL
export const mergeArrays = (originalArr, newArr) => {
  let copyArr = [...originalArr];
  let ids = new Set(originalArr.map(o => o._id)); // list of original IDs
  return newArr.filter(n => !ids.has(n._id)).concat(copyArr);
}

// used to only add non-existing values to array
export const pushUnique = () => {

}

// used to return a copy of a spliced array without modifying the original
export const safeSplice = (arr, startIdx, iterate) => {

}

/* Date Manipulation */

const months = [
  'January', 
  'February', 
  'March', 
  'April', 
  'May', 
  'June', 
  'July', 
  'August', 
  'September', 
  'October', 
  'November', 
  'December', 
];

export const getMonthName = (monthNumber) => {
  const abbr = months[monthNumber - 1];
  console.log('getMonthName --> ', monthNumber, abbr);
  return abbr;
}







