export const USER_LOGIN = "USER_LOGIN";

export const userService = {
  hello: () => console.log('hello world'),
  setItem: (userData) => {
    let userJSON = JSON.stringify(userData);
    localStorage.setItem(USER_LOGIN, userJSON);
  },
  getItem: () => {
    let userJSON = localStorage.getItem(USER_LOGIN);
    return userJSON ? JSON.parse(userJSON) : null;
  },
  removeItem: () => {
    localStorage.removeItem(USER_LOGIN);
  },
};
