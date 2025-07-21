import axios from 'axios';
import ApiUrl from './ApiUrl';

// Create instance first
const instance = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

// Intercept requests to inject the XSRF token from cookie
instance.interceptors.request.use((config) => {
  const xsrfToken = getCookieValue('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  return config;
});

function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default instance;
