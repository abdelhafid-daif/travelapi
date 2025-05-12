// api/chat.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const fetchMessages = async () => {
  const token = localStorage.getItem('access_token');
  const res = await axios.get(`${API_URL}/group-messages/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.reverse();  // du plus ancien au plus récent
};

export const sendMessage = async (content) => {
  const token = localStorage.getItem('access_token');
  const res = await axios.post(`${API_URL}/group-messages/`, { content }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
export const deleteAllGroupMessages = () => {
    const token = localStorage.getItem('access_token');
    return axios.delete(`${API_URL}/g-mgs-d/`,{
        headers: { Authorization: `Bearer ${token}` }
    });
  };