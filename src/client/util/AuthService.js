
import axios from './axiosCaller';

// returns authToken to JSON object
export function getAuthToken() {
  return JSON.parse(localStorage.getItem('authToken'));
}

// saves authToken to localStorage + creates Authorization header
export function setAuthToken(token) {
  localStorage.setItem('authToken', JSON.stringify(token));
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

// removes authToken from localStorage + deletes Authorization header
export function removeAuthToken() {
  localStorage.removeItem('authToken');
  axios.defaults.headers.common['Authorization'] = '';
}




