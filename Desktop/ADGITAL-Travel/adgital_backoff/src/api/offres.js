// offres.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Assurez-vous de mettre l'URL correcte

// Récupérer toutes les catégories
export const fetchCategories = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}categories-crud/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw new Error('Erreur API');
      }
    } else {
      throw new Error('Non authentifié');
    }
  };

// Ajouter une nouvelle catégorie
export const addCategory = async (category) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error("Token manquant ou utilisateur non authentifié.");
    }

    try {
        const response = await axios.post(`${API_URL}categories-crud/`, category, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la catégorie", error.response || error);
        throw new Error("Erreur API lors de l'ajout.");
    }
};

export const updateCategory = async (id, category) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`${API_URL}categories-crud/${id}/`, category, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur update:", error.response?.data);
      throw error;
    }
  };
  
  // Supprimer une catégorie
  export const deleteCategory = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${API_URL}categories-crud/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie", error);
      throw error;
    }
  };




  export const fetchDestination = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}destinations-crud/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des destinations:', error);
        throw new Error('Erreur API');
      }
    } else {
      throw new Error('Non authentifié');
    }
  };

  export const addDestination = async (destination) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error("Token manquant ou utilisateur non authentifié.");

    const formData = new FormData();
    formData.append('ville', destination.ville);
    formData.append('pays', destination.pays);
    formData.append('populaire', destination.populaire);
    if (destination.image) formData.append('image', destination.image);

    try {
        const response = await axios.post(`${API_URL}destinations-crud/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la destination", error.response || error);
        throw new Error("Erreur API lors de l'ajout.");
    }
};

export const updateDestination = async (id, data, isFormData = false) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`${API_URL}destinations-crud/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur update:", error.response?.data);
      throw error;
    }
  };
  
  export const deleteDestination = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${API_URL}destinations-crud/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la destination", error);
      throw error;
    }
  };



  export const getOffres = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error("Token manquant ou utilisateur non authentifié.");
  
    try {
      const response = await axios.get(`${API_URL}offres-crud/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Offres:', response);
      return response.data;
      
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error.response || error);
      throw new Error("Erreur API lors du fetch.");
    }
  };
  
  export const addOffre = async (data) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error("Token manquant ou utilisateur non authentifié.");
  
    try {
      const response = await axios.post(`${API_URL}offres-crud/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Détails de l'erreur backend :", error.response.data);
      } else {
        console.error("Erreur inattendue :", error);
      }
      throw new Error("Erreur API lors de l'ajout.");
    }
  };
  
  export const deleteOffre = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error("Token manquant ou utilisateur non authentifié.");
  
    try {
      await axios.delete(`${API_URL}offres-crud/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre:", error.response || error);
      throw new Error("Erreur API lors de la suppression.");
    }
  };
  
  export const updateOffre = async (id, data, isFormData = false) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error("Token manquant ou utilisateur non authentifié.");
  
    try {
      // Préparer les en-têtes d'authentification
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      // Si c'est un FormData, axios gère le Content-Type automatiquement
      if (isFormData) {
        const response = await axios.put(`${API_URL}offres-crud/${id}/`, data, { headers });
        return response.data;
      } else {
        // Si c'est du JSON, spécifie content-type comme application/json
        const response = await axios.put(`${API_URL}offres-crud/${id}/`, data, {
          headers: {
            ...headers,
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          },
        });
        return response.data;
      }
    } catch (error) {
      // Gérer les erreurs et afficher des informations supplémentaires
      if (error.response) {
        console.error("Erreur API lors de la mise à jour de l'offre:", error.response.data);
        throw new Error(`Erreur API : ${error.response.status} - ${error.response.data.detail || error.response.data}`);
      } else {
        console.error("Erreur de requête:", error.message);
        throw new Error("Erreur lors de la mise à jour de l'offre.");
      }
    }
  };


const token = localStorage.getItem('access_token');

const config = {
  headers: {
    Authorization: `Bearer ${token}`
  },
};

export const getDeparts = () => axios.get(`${API_URL}depart-details-crud/`, config);
export const getDepart = (id) => axios.get(`${API_URL}depart-details-crud/${id}/`, config);
export const createDepart = (data) => axios.post(`${API_URL}depart-details-crud/`, data, config);
export const updateDepart = (id, data) => axios.put(`${API_URL}depart-details-crud/${id}/`, data, config);
export const deleteDepart = (id) => axios.delete(`${API_URL}depart-details-crud/${id}/`, config);

export const getBooking = () => axios.get(`${API_URL}booking-dtst/`, config);
export const putBooking = (id, data) => {
  return axios.put(`${API_URL}booking-dtst/${id}/`, data, config);
};


export const getBookingManager = () => axios.get(`${API_URL}Manager-Bookingoff/`, config);


  

