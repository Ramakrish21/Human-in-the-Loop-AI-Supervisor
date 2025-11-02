import axios from 'axios';

// Create an 'instance' of axios.
const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;