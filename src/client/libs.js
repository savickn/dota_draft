String.prototype.replaceAt = function(index, replacement) {
  if (index >= this.length) {
      return this.valueOf();
  }

  return this.substring(0, index) + replacement + this.substring(index + 1);
}

export const updateByObjectId = (arr, newElem) => {
  return arr.map((elem) => {
    if(!elem._id || !newElem._id) { console.log('updateByObjectId --> ObjectId missing!') };
    return elem._id === newElem._id ? newElem : elem;
  });
}