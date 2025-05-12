import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Card, CardContent, CircularProgress, Grid, IconButton, Select, MenuItem, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { fetchChambres, addChambre,fetchHotels,updateChambre, deleteChambre } from '../../api/hotels';  // Crée des fonctions API correspondantes
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../../components/Sidebar';
const ChambreCrud = () => {
  const [chambres, setChambres] = useState([]);
  const [hotel, setHotel] = useState('');
  const [hotels, setHotels] = useState([]);  // Pour stocker les hôtels
  const [numero, setNumero] = useState('');
  const [typeChambre, setTypeChambre] = useState('');
  const [prixParNuit, setPrixParNuit] = useState('');
  const [capacite, setCapacite] = useState('');
  const [estDisponible, setEstDisponible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);  // Pour savoir si on est en mode édition
  const [currentChambre, setCurrentChambre] = useState(null);


  useEffect(() => {
    const fetchChambresData = async () => {
      const response = await fetchChambres();
      setChambres(response.data);
      setLoading(false);
    };
    fetchChambresData();
  }, []);
  useEffect(() => {
    const fetchHotelsData = async () => {
      try {
        const response = await fetchHotels();
        setHotels(response.data);  // Mettre à jour la liste des hôtels
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des hôtels', error);
        setLoading(false);
      } finally{
        setLoading(false);
      }
    };

    fetchHotelsData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chambreData = { hotel, numero, type_chambre: typeChambre, prix_par_nuit: prixParNuit, capacite, est_disponible: estDisponible };
    try {
      if (editMode) {
        // Si nous sommes en mode édition, on met à jour la chambre
        await updateChambre(currentChambre.id, chambreData);
        setEditMode(false);
      } else {
        // Sinon, on ajoute une nouvelle chambre
        await addChambre(chambreData);
      }
      setHotel('');
      setNumero('');
      setTypeChambre('');
      setPrixParNuit('');
      setCapacite('');
      setEstDisponible(true);
      setLoading(true);
      const response = await fetchChambres();
      setChambres(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la chambre', error);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (chambre) => {
    setEditMode(true);
    setCurrentChambre(chambre);
    setHotel(chambre.hotel);
    setNumero(chambre.numero);
    setTypeChambre(chambre.type_chambre);
    setPrixParNuit(chambre.prix_par_nuit);
    setCapacite(chambre.capacite);
    setEstDisponible(chambre.est_disponible);
  };

  const handleDelete = async (id) => {
    try {
      await deleteChambre(id);
      const response = await fetchChambres();
      setChambres(response.data);
    } catch (error) {
      console.error('Erreur lors de la suppression de la chambre', error);
    }
  };

  return (
    <Sidebar>
    <Box sx={{ padding: 4 }}>
    <Typography variant="h4" gutterBottom>Gestion des Chambres</Typography>
      {error && <Typography color="error">{error}</Typography>}
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} maxHeight={600}>


      <Box flex={2} sx={{maxWidth:460}}>
            {loading ? <CircularProgress /> : (
              <DataGrid rows={chambres} columns={[{ field: 'id', headerName: 'ID', width: 60 }, { field: 'numero', headerName: 'Numéro' , width: 80}, { field: 'prix_par_nuit', headerName: 'Prix' }, { field: 'capacite', headerName: 'Capacité', width: 80 },
              {
                field: 'actions',
                headerName: 'Actions',
                renderCell: (params) => (
                  <Box>
                    <IconButton onClick={() => handleEdit(params.row)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ),
              },]} pageSize={10} />
            )}

      </Box>
      <Card sx={{ flex: 1, minWidth: 300 }}>
        <CardContent>
      <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Hôtel</InputLabel>
          <Select value={hotel} onChange={(e) => setHotel(e.target.value)} label="Hôtel">
            {hotels.map((hotelItem) => (
              <MenuItem key={hotelItem.id} value={hotelItem.id}>
                {hotelItem.nom} - {hotelItem.adresse}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Numéro de Chambre" value={numero} onChange={(e) => setNumero(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type de Chambre</InputLabel>
            <Select
                value={typeChambre}
                onChange={(e) => setTypeChambre(e.target.value)}
                label="Type de Chambre"
            >
                <MenuItem value="simple">Simple</MenuItem>
                <MenuItem value="double">Double</MenuItem>
                <MenuItem value="suite">Suite</MenuItem>
            </Select>
        </FormControl>
        <TextField label="Prix par Nuit" type="number" value={prixParNuit} onChange={(e) => setPrixParNuit(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Capacité" type="number" value={capacite} onChange={(e) => setCapacite(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Disponibilité</InputLabel>
          <Select value={estDisponible} onChange={(e) => setEstDisponible(e.target.value)} label="Disponibilité">
            <MenuItem value={true}>Disponible</MenuItem>
            <MenuItem value={false}>Indisponible</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Ajouter Chambre
        </Button>
      </form>
      </CardContent>
      </Card>

    </Box>
    </Box>
    </Sidebar>
  );
};

export default ChambreCrud;
