import axios from "axios";
// File for API calls

const API = process.env.REACT_APP_API_URL;

// Register a new user
export const registerUser = async (userData) => {
  return axios.post(`${API}/auth/register`, userData);
};

// Login a user
export const loginUser = async (loginData) => {
  return axios.post(`${API}/auth/login`, loginData);
};
