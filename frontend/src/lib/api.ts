import axios from 'axios';

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!configuredApiUrl && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_API_URL must be set when building for production.');
}

const baseURL = configuredApiUrl || 'http://localhost:5000/api';

if (process.env.NODE_ENV === 'production') {
  let apiUrl: URL;
  try {
    apiUrl = new URL(baseURL);
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute HTTPS URL in production.');
  }

  if (apiUrl.protocol !== 'https:' || !apiUrl.pathname.replace(/\/+$/, '').endsWith('/api')) {
    throw new Error('NEXT_PUBLIC_API_URL must use HTTPS and end with /api in production.');
  }
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = typeof window === 'undefined' ? null : localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
