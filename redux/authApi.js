import axios from 'axios';

const API = axios.create({
   baseURL: 'https://web-production-cd53.up.railway.app/',
});

export const login = (loginData) => API.post('milesapi/login', loginData);
export const register = (registerData) =>
   API.post('milesapi/register', registerData);
