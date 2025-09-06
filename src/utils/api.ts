import axios from 'axios';

const api = axios.create({
  baseURL: "https://api.abler.com.br/v1", 
  timeout: 5000, 
});

api.interceptors.request.use(
  (config) => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJjb21wYW55X2lkIjo1MzY5LCJ0aW1lc3RhbXAiOiIyMDI0LTExLTEzIDE1OjA0OjMzICswMDAwIn0.Q9pi9ZEkowhG5YQ3RPstft5m2NhR8rw-NCPVNPiQ0y4"; 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;