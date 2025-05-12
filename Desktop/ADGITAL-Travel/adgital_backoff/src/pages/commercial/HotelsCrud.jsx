import React, { useState ,useEffect} from 'react';
import { TextField, Button, Box, Typography , Card,
    CardContent,
    CircularProgress,MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { fetchHotels,addHotel,fetchDestinations,deleteHotel, updateHotel } from '../../api/hotels';
import Sidebar from '../../components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const HotelsCrud = () => {
  const [hotels , setHotels]= useState([]);
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [etoiles, setEtoiles] = useState(3);
  const [description, setDescription] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [prix_init, setPrixinit] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    const fetchHotelsData = async () => {
      try {
        const response = await fetchHotels();
        console.log('hotels',response.data);
        setHotels(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError("Impossible de récupérer data hotels. Vérifiez vos permissions.");
      } finally {
        setLoading(false); 
      }
    };
    const fetchDistinationsData = async () => {
        try {
          const destinationsData = await fetchDestinations();
          setDestinations(destinationsData);
        } catch (error) {
          setError("Impossible de récupérer data distination. Vérifiez vos permissions.");
        } finally {
          setLoading(false); 
        }
      };

    fetchHotelsData();
    fetchDistinationsData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet hôtel ?")) {
      try {
        await deleteHotel(id);
        setHotels(hotels.filter(hotel => hotel.id !== id));
      } catch (error) {
        setError("Erreur lors de la suppression.");
      }
    }
  };
  
  const handleEdit = (hotel) => {
    setNom(hotel.nom);
    setAdresse(hotel.adresse);
    setEtoiles(hotel.etoiles);
    setDescription(hotel.description);
    setSelectedDestination(hotel.destinations.id);
    setEditingId(hotel.id);
    setPrixinit(hotel.prix_init);
    setLatitude(hotel.latitude);
    setLongitude(hotel.longitude);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newHotel = {
      nom,
      adresse,
      etoiles,
      description,
      prix_init,
      latitude,
      longitude,
      destinations_id: selectedDestination,
    };

    try {
        if (editingId) {
            await updateHotel(editingId, newHotel);
        } else {
            await addHotel(newHotel);
        }
      const response = await fetchHotels();
      setHotels(response.data);
      setNom('');
      setAdresse('');
      setEtoiles(3);
      setDescription('');
      setSelectedDestination('');
    } catch (error) {
      setError("Erreur lors de l'ajout de l'hôtel. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'nom', headerName: 'nom', width: 100 },
    { field: 'destinations_ville', headerName: 'ville', width: 90 },
    { field: 'destinations_pays', headerName: 'pays', width: 90 },
    { field: 'adresse', headerName: 'Adresse', width: 120 },
    { field: 'etoiles', headerName: 'etoiles', width: 50 },
    { field: 'description', headerName: 'description', width: 120 },
    { field: 'prix_init', headerName: 'a partire de', width: 80 },
    { field: 'latitude', headerName: 'Latitude', width: 80 },
    { field: 'longitude', headerName: 'Longitude', width: 80 },

    {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
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
      },
  ];

  return (
    <Sidebar>
    <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Gestion des hôtels</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" gap={4} flexWrap="wrap">

          <Card sx={{ flex: 1, minWidth: 240,maxWidth: 400 }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  fullWidth
                  required
                />
                <FormControl fullWidth sx={{ mt: 2 }}>                 
                 <InputLabel>Destination</InputLabel>
                  <Select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    label="Destination"
                    required
                  >
                    {destinations.map((destination) => (
                      <MenuItem key={destination.id} value={destination.id}>
                        {destination.ville}, {destination.pays}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Étoiles"
                  type="number"
                  value={etoiles}
                  onChange={(e) => setEtoiles(e.target.value)}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Prix Initiale"
                  type="number"
                  value={prix_init}
                  onChange={(e) => setPrixinit(e.target.value)}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Latitude"
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Longitude"
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                  {loading ? 'Ajout en cours...' : 'Ajouter l\'hôtel'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Box flex={2} >
            {loading ? <CircularProgress /> : (
              <DataGrid rows={hotels} columns={columns} sx={{maxWidth:950}} pageSize={5} />
            )}
          </Box>
        </Box>

      
    </Box>
    </Sidebar>
    
  );
};

export default HotelsCrud;
