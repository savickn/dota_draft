
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

export default class DateUtil {
  constructor() {

  }

  static getMonthName = (monthNumber) => {
    return months[monthNumber - 1];
  }
  

}

// 
export const getDifferenceInDays = (newDate, oldDate) => {
  const microSecondsDiff = Math.abs(newDate.getTime() - oldDate.getTime());
  // Number of milliseconds per day =
  //   24 hrs/day * 60 minutes/hour * 60 seconds/minute * 1000 msecs/second
  return Math.floor(microSecondsDiff/(1000 * 60 * 60  * 24));
}

