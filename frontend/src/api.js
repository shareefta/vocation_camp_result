import axios from 'axios';

// Using a relative path makes the app work automatically on any server (PythonAnywhere or Local)
const API_BASE_URL = '/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Request interceptor for putting token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`Sending request to ${config.url} with token.`);
  } else {
    console.warn(`No token found for request to ${config.url}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Response:", error.response);
    if (error.response?.status === 401) {
      // Don't auto-redirect for every 401 if it's potentially a transient error, 
      // but logout if it's a clear authentication failure
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
