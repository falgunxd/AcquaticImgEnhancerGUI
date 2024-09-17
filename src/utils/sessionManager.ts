// sessionManager.ts
const ACCESS_TOKEN_KEY = 'accessToken';

export const setAccessToken = (token: string) => {
  // console.log("Setting access token", token);
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  // console.log("Getting access Token", localStorage.getItem(ACCESS_TOKEN_KEY));
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  // console.log("Removing access token", localStorage.getItem(ACCESS_TOKEN_KEY));
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
