import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
const devApiBaseUrl = process.env.REACT_APP_ABLER_PROXY_URL || 'http://localhost:3001/v1';

const api = axios.create({
  baseURL: isProduction ? '/abler-api/v1' : devApiBaseUrl,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;