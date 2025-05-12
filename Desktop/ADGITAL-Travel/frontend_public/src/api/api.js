const BASE_URL = 'http://127.0.0.1:8000/api/';  // Replace with your actual Django API URL
const API_URL ='http://127.0.0.1:8000/'
import axios from 'axios';
// Fetch categories
export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}categories/`);
  const data = await response.json();
  return data;
};

// Fetch destinations
export const fetchDestinations = async () => {
  const response = await fetch(`${BASE_URL}destinations/`);
  const data = await response.json();
  return data;
};

// Fetch offers
export const fetchOffers = async () => {
  const response = await fetch(`${BASE_URL}offres/`);
  const data = await response.json();
  return data;
};

export const fetchPopularDestinations = async () => {
    const response = await fetch(`${BASE_URL}popular-destinations/`);
    const data = await response.json();
    console.log('data fetched:',data);
    return data;
  };
  
  // Fetch popular offers
  export const fetchPopularOffers = async () => {
    const response = await fetch(`${BASE_URL}popular-offres/`);
    const data = await response.json();
    return data;
  };

  export const getHotels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}hotels/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des hôtels :', error);
      return [];
    }
  };

  export const getHotelById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}hotels/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du chargement de l’hôtel :', error);
      return null;
    }
  };

  export const createReservation = async (reservationData) => {
    try {
      const response = await axios.post(`${API_URL}reservations/`, reservationData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error);
      throw error;
    }
  };