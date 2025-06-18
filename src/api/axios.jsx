// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.121.214.108:5000/api', // change to your production URL later
});

export default api;
