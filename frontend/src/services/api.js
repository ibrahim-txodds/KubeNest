// frontend/src/services/api.js
import axios from 'axios';

export const listNamespaces = async () => {
  return await axios.get('/namespaces').then(response => response.data);
};
