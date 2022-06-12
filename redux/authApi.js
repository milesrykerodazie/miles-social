import axios from "axios";

const API = axios.create({
  baseURL: "https://milessocial-media-backend.herokuapp.com/",
});

export const login = (loginData) => API.post("milesapi/login", loginData);
export const register = (registerData) =>
  API.post("milesapi/register", registerData);
