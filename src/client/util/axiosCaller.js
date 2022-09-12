import axios from 'axios';
import config from '../../server/config/environment';

export const BASE_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test') ?
  process.env.BASE_URL || (`http://localhost:${process.env.PORT || config.port}`) :
  '/';

var instance = axios.create({});

instance.defaults.baseURL = BASE_URL;
if (typeof window !== 'undefined') {
  instance.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem('authToken'))}` || '';
}

export default instance;
