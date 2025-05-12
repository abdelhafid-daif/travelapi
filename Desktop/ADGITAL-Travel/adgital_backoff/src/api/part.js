import axios from 'axios';
import { data } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/';
const BASE_URL = 'http://localhost:8000/';

const token = localStorage.getItem('access_token');

const config = {
  headers: {
    Authorization: `Bearer ${token}`
  },
};

export const getPartenaire = () => axios.get(`${API_URL}part-crud/`, config);
export const createPartenaire = async (data) => {
  try {
    const response = await axios.post(`${API_URL}part-crud/`, data, config);
    console.log('Partenaire created', response.data);
  } catch (error) {
    console.error('Error creating partenaire:', error.response.data); 
  }
};
export const getPartContrats = (partenaireId) => {
  const url = `${API_URL}contrats-part/?partenaire_id=${partenaireId}`;
  return axios.get(url, config);
};
export const getSecureFileContratUrl = (contrat) => {
  return `${contrat}`;
};
export const getSecureFilesContratUrl = (fil) => {
  const mediaUrl = import.meta.env.VITE_MEDIA_URL; 
  return `${mediaUrl}/media/${fil}`; 
};
export const createContrats = async (data) => {
  try {
    
    const response = await axios.post(`${API_URL}contrats-part/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Contrat created', response.data);
  } catch (error) {
    console.error('Error creating contrat:', error.response.data);
  }
};

export const getBookingConfermed = () => axios.get(`${API_URL}compt-bookings/`, config);
export const createFacture = async (bookingId,data) => {
  try {
    console.log('Données envoyées:', data);
    const response = await axios.post(`${BASE_URL}options_extras/${bookingId}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Contrat créé', response.data);
    return response;
  } catch (error) {
    console.error('Erreur lors de la création du contrat:', error.response?.data || error);
  }
}

export const getBookingFactures = () => axios.get(`${API_URL}compt-factures/`, config);

export const getFacture = (factureId) => {
  return api.get(`compt-factures/${factureId}/`,config);
};

export const updateFactureStatut = async (factureId, newStatut) => {
  return await axios.patch(`${API_URL}compt-factures/${factureId}/update-statut/`, { statut: newStatut },config);
};

// Fonction pour enregistrer un paiement
export const createPaiement = (factureId, montant, methode, note) => {
  return api.post('paiements/', {
    facture: factureId,
    montant,
    methode,
    note,
  },config);
};
export const createArchiveFacture = (formData) => axios.post(`${API_URL}historique_paiements/`, formData, config);
export const createArchiveFactureHotel = (formData) => axios.post(`${API_URL}historique_paiements_hotel/`, formData, config);

export const getSecureFileUrl = (fileName) => {
  return `${BASE_URL}media/factures/${fileName}`;
};
export const getArchiveFacture = () => axios.get(`${API_URL}historique_paiements/`, config);
export const getArchiveFactureHotel = () => axios.get(`${API_URL}historique_paiements_hotel/`, config);

export const fetchPartenaireStats = async () => {
  const res = await axios.get(`${BASE_URL}stats-partenaires/`,config);
  return res.data;
};

export const fetchContratStats = async () => {
  const res = await axios.get(`${BASE_URL}stats-contrats/`,config);
  return res.data;
};

export const fetchFactureStats = async () => {
  const res = await axios.get(`${BASE_URL}stats-factures/`,config);
  return res.data;
};
export const fetchPaiementsStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}statistiques-paiements`,config);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur dans la récupération des paiements:', error);
    throw error;
  }
};

export const getStaff = () => axios.get(`${BASE_URL}mng-profiles/`, config);
export const updateStaff = (id, data)=> axios.patch(`${BASE_URL}mng-profiles/${id}/`,data, config);

export const getStatsbokoff = () => axios.get(`${BASE_URL}booking-stats-by-offre/`, config);
export const getStatsdestoff = () => axios.get(`${BASE_URL}offres-par-destination/`, config);
export const getStatsbokoffdate = () => axios.get(`${BASE_URL}booking-stats-date/`, config);
export const getStatsbokmng = () => axios.get(`${BASE_URL}booking-stats/`, config);
