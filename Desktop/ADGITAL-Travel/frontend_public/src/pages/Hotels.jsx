import React, { useEffect, useState } from 'react';
import {Box, Card, CardContent, Typography, CardOverflow, AspectRatio, Chip, Grid,Button,Divider ,Stack } from '@mui/joy';
import { getHotels } from '../api/api';
import SousNavbar from '../components/SousNavbar';
import Navbar from '../components/Navbar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      const data = await getHotels();
      console.log("Données reçues :", data); // ← Vérifie ici
      setHotels(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <Typography>Chargement des hôtels...</Typography>;
  }

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
Du luxe au charme local, trouvez l’hôtel qui rendra votre séjour unique.
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

  <Divider sx={{pt: 8,}}>
  <Stack
  direction="row"
  spacing={1}
  alignItems="center"
  justifyContent="center"
  sx={{
    p: { xs: 1, sm: 2, },
    flexWrap: 'wrap', // Permet le retour à la ligne sur petits écrans
    textAlign: 'center',
    mb:2
    
  }}
>
  {/* <LoyaltyIcon sx={{
    color: '#C70039',
    fontSize: { xs: 24, sm: 30, md: 36 }
  }} /> */}
  <Typography
    level="h2"
    sx={{
      fontWeight: 'bold',
      color: '#070046',
      fontFamily: "'Funnel Display', bold",
      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
    }}
  >
    Profitez d'&nbsp;
    <span
      style={{
        fontFamily: "'Funnel Display', bold",
        color: '#C70039',
        fontWeight: 'bold',
      }}
    >
      Hotel
    </span>&nbsp;exceptionnels !
  </Typography>
</Stack>

</Divider>
<Box  sx={{ px: 3, pb: 4, p:3 }}>
  <Grid container spacing={3}>
      {hotels.map((hotel) => (
        <Grid  xs={12} sm={6} md={4} lg={3} key={hotel.id}>
          <Card variant="outlined" sx={{maxWidth:300}}>
            <CardOverflow>
              <AspectRatio ratio="4/3">
                <img
                  src={hotel.images?.[0]?.image_url || 'https://via.placeholder.com/400'}
                  alt={hotel.nom}
                  loading="lazy"
                />
                  <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    px: 1.5,
                    borderRadius: 12,
                  }}
                >
                  <Typography sx={{ color: '#FFD700', fontSize: '1.2rem' }}>
                    {'★'.repeat(hotel.etoiles)}
                  </Typography>
                </Box>
              </AspectRatio>
            </CardOverflow>
            <CardContent>
            <Typography level="body1" sx={{ fontWeight: 'bold' }} color="danger">
             {hotel.nom}
            </Typography>
            <Chip variant="soft" color="success" size="lg">
                A partir de {hotel.prix_init} MAD
            </Chip>
              <Typography level="body2" fontSize="sm" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon fontSize="small" />
                {hotel.adresse}
             </Typography>
             <Chip variant="soft" color="primary" size="lg">
                {hotel.etoiles} ★
              </Chip>
              <Typography mt={1} fontSize="sm">{hotel.description}</Typography>
            </CardContent>
            <CardOverflow>
                <Button variant="solid" color="danger" size="lg" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                 Réserver
                </Button>
            </CardOverflow>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
    <Footer/>
    </Box>
  );
};
export default Hotels;
