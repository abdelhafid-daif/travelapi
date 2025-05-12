import React, { useState, useEffect } from 'react';
import {
  Sheet,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
} from '@mui/joy';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseIcon from '@mui/icons-material/Close';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api/api';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

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
    setActiveCategory(catId);
    navigate(`/categorie/${catId}`);
  };

  return (
    <>
      <Sheet
        sx={{
          px: 3,
          py: 2,
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          zIndex: 1200,
          backgroundColor: '#f9fafb66',
          boxShadow: 'sm',
          width: '100%',
        }}
      >
        {/* Logo + Titre */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => navigate('/')}>
          <FlightTakeoffIcon fontSize="large" sx={{ color: "#C70039", fontSize: { xs: '0.8rem', sm: '1.2rem', md: '1.6rem' } }} />
          <Typography level="h5" fontWeight="lg" sx={{ color: "#C70039", fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } }}>
            Travel<span>Demo</span>
          </Typography>
        </Box>

        {/* Menu Desktop */}
        <Box sx={{     flexGrow: 1,
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        gap: 2 }}>
          {[
            { label: 'Accueil', path: '/' },
            { label: 'Destinations', path: '/Destinations' },
            { label: 'Tours', path: '/Offres' },
            { label: 'Hotels', path: '/Hotels' },
          ].map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                position: 'relative',
                fontWeight: 500,
                color: '#C70039',
                px: 2,
                py: 1,
                textTransform: 'none',
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: '2px',
                  width: '0%',
                  backgroundColor: '#C70039',
                  transition: 'width 0.3s',
                },
                '&:hover::after': {
                  width: '100%',
                },
                '&:hover': {
                  color: '#C70039',
                  backgroundColor: 'transparent',
                },
              }}
              variant="plain"
            >
              {item.label}
            </Button>
          ))}


        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              sx={{
                backgroundColor: '#C70039',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#a6002c',
                },
              }}
              onClick={() => navigate('/login')}
            >
              Espace Client
            </Button>
          </Box>

        {/* Bouton Menu Mobile */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={() => setOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
        </Box>
      </Sheet>

      {/* Drawer Mobile */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        sx={{ zIndex: 1400,    width: { xs: '100%', sm: 300 }, // 100% en mobile, 300px en tablette ou plus
        maxWidth: '100%',}}
        
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography level="h5" fontWeight="lg">Menu</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            <ListItem>
              <Box display="flex" alignItems="center" gap={1} onClick={() => { navigate('/'); setOpen(false); }}>
                <FlightTakeoffIcon sx={{ color: "#C70039" }} />
                <Typography level="h5" fontWeight="lg" sx={{ color: "#C70039" }}>Travel<span>Demo</span></Typography>
              </Box>
            </ListItem>

            {[
              { label: 'Destinations', path: '/Destinations' },
              { label: 'Tours', path: '/Offres' },
              { label: 'Hotels', path: '/Hotels' },
            ].map((item) => (
              <ListItem key={item.path}>
                <Button
                  fullWidth
                  variant="soft"
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              </ListItem>
            ))}

            {/* Catégories dynamiques */}
            {categories.map((cat) => (
              <ListItem key={cat.id}>
                <Button
                  fullWidth
                  variant={activeCategory === cat.id ? 'solid' : 'soft'}
                  onClick={() => {
                    handleCategoryClick(cat.id);
                    setOpen(false);
                  }}
                  sx={{
                    backgroundColor: activeCategory === cat.id ? '#fff' : '#C70039',
                    color: activeCategory === cat.id ? '#C70039' : '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                      color: '#C70039',
                    },
                  }}
                >
                  {cat.nom}
                </Button>
              </ListItem>
            ))}

            <ListItem>
              <Button
                fullWidth
                sx={{
                  backgroundColor: '#C70039',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#a6002c',
                  },
                }}
                onClick={() => {
                  navigate('/login');
                  setOpen(false);
                }}
              >
                Espace Client
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
