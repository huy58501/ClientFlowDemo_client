const API_BASE_URL = process.env.API_BASE_URL;
//const API_BASE_URL = 'http://localhost:8080';

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_USERS: `${API_BASE_URL}/users`,
  GET_USER_ME: `${API_BASE_URL}/users/me`,
};
