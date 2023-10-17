import axios from 'axios';

import { useAuth } from '@/stores/auth';

export default {
  install: (app, { baseURL, prefixAPI = '/', options }) => {
    const { $router } = app.config.globalProperties;

    const store = useAuth();

    const axiosInstance = axios.create({
      baseURL: baseURL + prefixAPI,
      timeout: options.timeout,
      headers: options.headers
    });

    axiosInstance.interceptors.request.use(
      async config => {
        const token = store.getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      response => {
        return response.data;
      },
      async error => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('The request has timed out. Please try again later.');
        }
        if (error?.response && error?.response?.status === 401) {
          store.resetAccessToken();
          $router.push({ name: 'connect' });
        }
        return Promise.reject(error);
      }
    );

    app.config.globalProperties.$axios = axiosInstance;

    app.provide('axios', app.config.globalProperties.$axios);
  }
};
