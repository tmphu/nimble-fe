import { http } from './configURL';

export const USER_LOGIN = "user_info";
export const JWT = "token";

export const userService = {
  signUp: async (payload) => {
    try {
      const data = await http.post(`/api/v1/auth/signup`, payload);
      return data?.data;
    } catch (err) {
      throw err.response?.data;
    }
  },
  login: async (payload) => {
    try {
      const data = await http.post(`/api/v1/auth/login`, payload);
      return data?.data;
    } catch (err) {
      throw err.response?.data;
    }
  },
  validateToken: async (token) => {
    if (!token) return false;
    try {
      const data = await http.post(`/api/v1/auth/validate-token`, { token });
      return data?.data;
    } catch (err) {
      throw err.response?.data;
    }
  },
  setUserInfo: (userData) => {
    let userJSON = JSON.stringify(userData);
    localStorage.setItem(USER_LOGIN, userJSON);
  },
  getUserInfo: () => {
    let userJSON = localStorage.getItem(USER_LOGIN);
    return userJSON ? JSON.parse(userJSON) : null;
  },
  setJwt: (jwt) => {
    localStorage.setItem(JWT, jwt);
  },
  getJwt: () => {
    return localStorage.getItem(JWT);
  },
  signOut: () => {
    localStorage.removeItem(USER_LOGIN);
    localStorage.removeItem(JWT);
  },
};
