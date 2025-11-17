import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

/*
 * Interceptor
 */
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    
    // Jika ada token, tempelkan ke header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Interceptor Respons
 */
api.interceptors.response.use(
  (response) => response, // Langsung teruskan jika sukses
  (error) => {
    // Jika server merespons 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Token Anda salah atau expired
      localStorage.removeItem('token');
      
      // kick admin kembali ke halaman login
      if (window.location.pathname !== '/cms/login') {
        window.location.href = '/cms/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;