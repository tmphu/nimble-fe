import axios from 'axios';
import { userService } from './userService';

export const BASE_URL = "http://localhost:3000";

export const createConfig = () => {
  return {
    Authorization: `Bearer ${userService.getJwt()}`,
  };
};

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

http.interceptors.request.use(config => {
  config.headers = createConfig();
  return config;
})