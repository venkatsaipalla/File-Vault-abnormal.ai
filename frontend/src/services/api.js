import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getFiles = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== '' && filters[key] !== false && filters[key] !== null) {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/files/?${params.toString()}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/files/stats/');
  return response.data;
};

export const downloadFile = async (fileId, fileName) => {
  const response = await api.get(`/files/${fileId}/download/`, {
    responseType: 'blob',
  });

  // Create blob link and download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

