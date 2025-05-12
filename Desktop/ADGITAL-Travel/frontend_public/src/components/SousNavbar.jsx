import React, { useEffect, useState } from 'react';
import { Box, Stack, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api/api';
import OffreSearch from './OffreSearch';

const SousNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);  // État pour la catégorie active
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories :', error);
      }
    };
    getCategories();
  }, []);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);  // Mettre à jour la catégorie active
    navigate(`/categorie/${catId}`);
  };

  return (
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
  <Box
    sx={{
      backgroundColor: '#C70039',
      borderBottom: '1px solid #ddd',
      py: 1,
      px: 2,
      boxShadow: 'sm',
      borderRadius: 18,
      height:80,
      minWidth:600,
      justifyContent: 'center',
      alignItems: 'center', 
    }}
  >

        
    <OffreSearch sx={{ border: 0, mb: 0 ,m:0}} />

      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={activeCategory === cat.id ? "solid" : "soft"}
          color={activeCategory === cat.id ? "primary" : "neutral"}
          size="lg"
          onClick={() => handleCategoryClick(cat.id)}
          sx={{
            whiteSpace: 'nowrap',
            fontWeight: 600,
            padding:1,
            backgroundColor: activeCategory === cat.id ? '#fff' : '#C70039',
            color: activeCategory === cat.id ? '#C70039' : '#fff',
            minWidth:'80px',
            
            borderRadius: 'lg',
            '&:hover': {
              backgroundColor: '#fff',
              color: '#C70039',
            },
          }}
        >
          {cat.nom} 
        </Button>
      ))}

  </Box>
</Box>
  );
};

export default SousNavbar;
