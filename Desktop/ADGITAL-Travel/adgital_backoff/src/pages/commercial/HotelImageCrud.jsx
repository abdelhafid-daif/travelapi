import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, Grid, IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { fetchHotelImages, addHotelImage, updateHotelImage, deleteHotelImage } from '../../api/hotels';
import { fetchHotels } from '../../api/hotels';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../../components/Sidebar';

const HotelImageCrud = () => {
  const [hotelImages, setHotelImages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [ordre, setOrdre] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const hotelsResponse = await fetchHotels();
        setHotels(hotelsResponse.data);
        
        const imagesResponse = await fetchHotelImages();
        setHotelImages(imagesResponse.data);
      } catch (error) {
        setError("Impossible de récupérer les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette image ?')) {
      try {
        await deleteHotelImage(id);
        setHotelImages(hotelImages.filter(image => image.id !== id));
      } catch (error) {
        setError('Erreur lors de la suppression.');
      }
    }
  };

  const handleEdit = (image) => {
    setImageUrl(image.image_url);
    setOrdre(image.ordre);
    setSelectedHotel(image.hotel.id);
    setEditingId(image.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('hotel', selectedHotel);
    formData.append('ordre', ordre);
    formData.append('image_url', imageUrl);

    try {
      if (editingId) {
        await updateHotelImage(editingId, formData);
      } else {
        await addHotelImage(formData);
      }

      const response = await fetchHotelImages();
      setHotelImages(response.data);
      resetForm();
    } catch (error) {
      setError('Erreur lors de l\'ajout ou mise à jour de l\'image.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImageUrl(null);
    setOrdre(0);
    setSelectedHotel('');
    setEditingId(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'hotel', headerName: 'Hôtel-id', width: 70},
    { field: 'hotel_name', headerName: 'Hôtel', width: 100},
    { field: 'ordre', headerName: 'Ordre', width: 70 },
    { field: 'image_url', headerName: 'Image', width: 130, renderCell: (params) => <img src={params.row.image_url} alt="Hotel" style={{ width: '100%', height: 'auto' }} /> },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <Sidebar>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Gestion des Images des Hôtels</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>

          <Box flex={2}>
            {loading ? <CircularProgress /> : (
              <DataGrid rows={hotelImages} columns={columns} pageSize={5} autoHeight />
            )}
          </Box>

          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Hôtel</InputLabel>
                  <Select
                    value={selectedHotel}
                    onChange={(e) => setSelectedHotel(e.target.value)}
                    label="Hôtel"
                    required
                  >
                    {hotels.map((hotel) => (
                      <MenuItem key={hotel.id} value={hotel.id}>{hotel.nom}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Veuillez sélectionner l'hôtel</FormHelperText>
                </FormControl>

                <TextField
                  label="Ordre"
                  type="number"
                  value={ordre}
                  onChange={(e) => setOrdre(e.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageUrl(e.target.files[0])}
                  required
                  style={{ marginBottom: '16px' }}
                />

                <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
                  {loading ? 'Enregistrement en cours...' : 'Enregistrer l\'image'}
                </Button>
              </form>
            </CardContent>
          </Card>

        </Box>
      </Box>
    </Sidebar>
  );
};

export default HotelImageCrud;
