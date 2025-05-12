import React, { useState } from 'react';
import { Box,Button } from '@mui/joy';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/joy/Input';


const OffreSearch = () => {
  const [destination, setDestination] = useState('');
  const [nom, setNom] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/offres-sherch/', {
        params: {
          destination: destination,
          nom: nom,
        },
      });
      navigate(`/offres?destination=${destination}&nom=${nom}`);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  return (
    <Box

      display="flex"
      gap={2}
      flexWrap="wrap"
      justifyContent="center"
      sx={{
        mb: 1,
        m:1,
        borderRadius: 8,
        padding: 0,

      }}
    >

      {/* <TextField
        label="Type d'offre"
        placeholder="Nom de l'offre"
        variant="outlined"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      /> */}

<Input
  color="danger"
  variant="outlined"
  label="Destination"
  placeholder="Entrez votre destination"
  value={destination}
  onChange={(e) => setDestination(e.target.value)}
  endDecorator={
    <Button
      variant="soft"
      color="danger"
      
      sx={{ borderRadius: 'sm', minWidth: 'auto', px: 1.5  ,backgroundColor:'transparent'}}
      onClick={() => console.log('Recherche :', destination)} // Ajoute ton action ici
    >
      <SearchIcon />
    </Button>
  }
  sx={{
    width: 300,
    borderRadius: 'md',
    bgcolor: '#fff',
    boxShadow: 'sm',
  }}
/>
    </Box>
  );
};

export default OffreSearch;
