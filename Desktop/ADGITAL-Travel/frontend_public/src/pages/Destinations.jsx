import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardCover, CardContent ,Stack,Divider} from '@mui/joy';
import Tooltip from '@mui/joy/Tooltip';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { TextField  } from '@mui/material';
import IconButton from '@mui/joy/IconButton';
import AspectRatio from '@mui/joy/AspectRatio';
import NewLabelIcon from '@mui/icons-material/NewLabel';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import Navbar from '../components/Navbar';
import { fetchDestinations } from '../api/api';
import SousNavbar from '../components/SousNavbar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility'
import Footer from '../components/Footer';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const destinationsData = await fetchDestinations();
      setDestinations(destinationsData);
      console.log('distination',destinationsData);
    };

    loadData();
  }, []);

  return (
    <Box>
      <Navbar />
<Box
  sx={{
    position: 'relative',
    height: { xs: '400px', sm: '500px', md: '600px' },
    width: '100%',
    backgroundImage: 'url("/dest.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    mb: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    px: 2, // Padding horizontal pour petits écrans
    pt: { xs: 4, sm: 6, md: 8 },
  }}
>
<Typography
  level="h1"
  sx={{
    fontSize: { xs: '1.2rem', sm: '1.3rem', md: '2.2rem', lg: '3rem' },
    fontWeight: 'xl',
    color: '#fff',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontFamily: "'Poetsen One', bold",
    textShadow: '2px 2px 6px rgba(0,0,0,0.5)', // ombre subtile
    animation: 'zoomOut 1.5s ease-out forwards',
    '@keyframes zoomOut': {
      '0%': {
        transform: 'scale(1.5)',
        opacity: 0,
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 1,
      },
    },
  }}
>
Parcourez nos destinations exceptionnelles.
</Typography>



  <Box
    sx={{
      mt: -4,
      position: 'absolute',
      bottom: '-70px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: { xs: '50%', sm: '45%', md: '50%' },
      height: { xs: '110px', sm: '120px', md: '130px' },
      zIndex: 10,
      borderRadius: 18,
      alignItems: 'center', 
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    
    <SousNavbar />
    
  </Box>
</Box>
      {/* Hero section */}



      <Divider sx={{pt: 8,}}>
<Stack
    direction="row"
    spacing={1}
    alignItems="center"
    justifyContent="center"
    sx={{ p: 1, pt: 0 }} // pt = paddingTop (au moins 50px)
  >
    <Typography
      level="h2"
      sx={{
        fontWeight: 'bold',
        color: '#070046',
        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
      }}
    >
      Destination
    </Typography>
    
  </Stack>
  </Divider>
     
      <Box
  sx={{
    px: 3,
    pb: 5,
    mx: { xs: 0, md: 1, lg: 20 }, // marges horizontales variables
  }}
>
<Grid container spacing={3} justifyContent="center">
  {destinations.map((destination, i) => (
    <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
        <Box
          key={i}
          sx={{
            width: 250,
            height: 300,
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            scrollSnapAlign: 'start',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            flexShrink: 0,
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Link to={`/destinations/${destination.id}/offres`}>
            <Card sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <CardCover>
                <img
                  src={destination.image}
                  alt={destination.ville}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </CardCover>
  
              <CardCover
                sx={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 2,
                }}
              >
                <Typography level="title-lg" textColor="#fff">
                  {destination.pays}
                </Typography>
                <Typography startDecorator={<LocationOnRoundedIcon />} textColor="neutral.300">
                  {destination.ville}
                </Typography>
  
                {/* Boutons d'action au hover */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                    opacity: 0,
                    transform: 'translateY(-10px)',
                    transition: 'all 0.3s ease-in-out',
                    '.MuiCard-root:hover &': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  <IconButton sx={{ color: 'white' }}>
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'white' }}>
                    <ShareIcon />
                  </IconButton>
                </Box>
  
                <Button
                  variant="soft"
                  color="primary"
                  size="sm"
                  startIcon={<VisibilityIcon />}
                  sx={{
                    mt: 1,
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease-in-out',
                    '.MuiCard-root:hover &': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  Voir plus
                </Button>
              </CardCover>
            </Card>
          </Link>
        </Box>
        </Grid>
      ))}
      </Grid>
    </Box>
<Footer/>
    </Box>
  );
}
