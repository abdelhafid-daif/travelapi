import axios from 'axios';
const API_URL = 'http://localhost:8000/hot/';
const BASE_URL = 'http://127.0.0.1:8000/api/';
const token = localStorage.getItem('access_token');

const config = {
  headers: {
    Authorization: `Bearer ${token}`
  },
};
export const fetchDestinations = async () => {
    const response = await fetch(`${BASE_URL}destinations/`);
    const data = await response.json();
    console.log('data destinations:',data);
    return data;
  };
export const fetchHotels = () => axios.get(`${API_URL}hotels/`, config);
export const addHotel = async (hotelData) => {
    try {
        const response = await axios.post(`${API_URL}hotels/`, hotelData, config);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'hôtel:', error);
        throw error;
    }
  };
export const updateHotel = async (id, data) => {
    return axios.put(`${API_URL}hotels/${id}/`, data, config);
  };
export const deleteHotel = async (id) => {
    return axios.delete(`${API_URL}hotels/${id}/`, config);
  };

export const fetchHotelImages = () => axios.get(`${API_URL}hotel-images/`,config);
export const addHotelImage = (imageData) => axios.post(`${API_URL}hotel-images/`, imageData, config);
export const updateHotelImage = (id, data) => axios.put(`${API_URL}hotel-images/${id}/`, data, config);
export const deleteHotelImage = (id) => axios.delete(`${API_URL}hotel-images/${id}/`,config);

export const fetchChambres = () => axios.get(`${API_URL}chambers/`,config);
export const addChambre = (chambreData) => axios.post(`${API_URL}chambers/`, chambreData, config);
export const updateChambre = (id, data) => axios.put(`${API_URL}chambers/${id}/`, data, config);
export const deleteChambre = (id) => axios.delete(`${API_URL}chambers/${id}/`,config);

export const fetchReservations = () => axios.get(`${API_URL}reservations/`, config);
export const fetchReservationDetails  = (id) => axios.get(`${API_URL}reservations/${id}`, config);
export const updateReservations = (id, data) => axios.put(`${API_URL}reservations/${id}/`, data, config);

export const fetchDevis = () => axios.get(`${API_URL}devis/`, config);
export const fetchFactures = () => axios.get(`${API_URL}factures/`, config);
export const createFacture = async (reservationId, data) => {
  try {
    const response = await axios.post(`${API_URL}facture-create/${reservationId}/`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

