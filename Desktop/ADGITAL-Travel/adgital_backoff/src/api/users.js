import axios from 'axios';

const API_URL = 'http://localhost:8000';
export default API_URL;
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, userData);
    return response.data;  // Retourne la réponse après une inscription réussie
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
  }
};

export const loginUser = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/token/`, {
        username,
        password
      });
      const { access, refresh } = response.data;
      
      // Sauvegarde du token JWT dans le localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      configureAxios();
      await axios.get(`${API_URL}/update-connection/`, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      const user = await getUser();  // appelle la fonction getUser définie plus bas
  
      return { token: access, user };
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erreur lors de la connexion');
    }
  };

  export const getUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }
    } else {
      throw new Error('Non authentifié');
    }
  };

  export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
      const { access } = response.data;
      
      // Sauvegarde du nouveau token d'accès
      localStorage.setItem('access_token', access);
      configureAxios();
      return access;
    } catch (error) {
      throw new Error('Erreur lors du rafraîchissement du token');
    }
  };

  export const configureAxios = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };
  export const fetchUsersStatus = async () => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/users-status/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  
export const getUserRole = async () => {
    const user = await getUser(); // Get the authenticated user
    if (!user) {
      return 'unknown'; // If there's no user, return unknown
    }
  
    // Get the profile associated with the user
    const profile = await user.profile; // Assuming there's a 'profile' attribute on the user
  
    // Check the user's role from the profile model
    if (profile.is_support) return 'support';
    if (profile.is_manager) return 'manager';
    if (profile.is_commercial) return 'commercial';
    if (profile.is_comptable) return 'comptable';
    
    return 'unknown'; // If no role is found, return unknown
  };

  export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };
