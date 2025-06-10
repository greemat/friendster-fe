// utils/axios.ts
import { API_BASE_URL } from '@env';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 10000,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    //console.log('Token from SecureStore:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
