import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardCover, CardContent ,CardOverflow  ,Stack,Divider} from '@mui/joy';
import Tooltip from '@mui/joy/Tooltip';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { TextField  } from '@mui/material';
import IconButton from '@mui/joy/IconButton';
import AspectRatio from '@mui/joy/AspectRatio';
import NewLabelIcon from '@mui/icons-material/NewLabel';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import Navbar from '../components/Navbar';
import { fetchOffers } from '../api/api';
import SousNavbar from '../components/SousNavbar';
import HotelIcon from '@mui/icons-material/Hotel';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import UpdateIcon from '@mui/icons-material/Update';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Chip from '@mui/joy/Chip';
import Footer from '../components/Footer';


export default function Home() {
  const [offers, setOffres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const offerssData = await fetchOffers();
      setOffres(offerssData);
      console.log('distination',offerssData);
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
Partez l’esprit tranquille grâce à nos packs tout compris, pensés pour vous.
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
    Profitez de nos&nbsp;
    <span
      style={{
        fontFamily: "'Funnel Display', bold",
        color: '#C70039',
        fontWeight: 'bold',
      }}
    >
      packages
    </span>&nbsp;exceptionnels !
  </Typography>
</Stack>

</Divider>
      {/* Hero section */}


<Box  sx={{ px: 3, pb: 4,p:2 }}>
  <Grid container spacing={3}>
    {offers.map((offer, i) => (
      <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
       <Card
          sx={{
            width: '100%',          // Prend toute la largeur possible du grid item
            maxWidth: 280,          // Limite la taille max
            mx: 'auto',             // Centre la carte
            p: 1,
            boxShadow: 'lg',
            borderRadius: 10,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            },
          }}
        >
      <CardOverflow>
        <AspectRatio sx={{ minWidth: 200 }}>
          <img src={offer.image_principale} loading="lazy" alt={offer.titre} />
        </AspectRatio>
        <Box
    sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: '#21ca8994',
      color: 'white',
      px: 1.5,
      py: 0.5,
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 1,
    }}
  >
    {offer.categorie.nom}
  </Box>
      </CardOverflow>
      <CardContent sx={{ borderRadius: 8,}}>
      {offer.destinations.length > 0 && (
      <Typography
        level="body5"
        startDecorator={<LocationOnRoundedIcon sx={{ color: '#C70039', fontSize: 18 }}/>}
        sx={{
          color: '#070046',
        }}
        
      >
        {offer.destinations[0].ville}
      </Typography>
    )}
        <Typography level="title-lg"
          sx={{ mt: 0 ,color:'#070046'}}>{offer.titre}</Typography>

    {offer.depart_details.length > 0 && (
      <>
        <Typography level="body-xs" >
          📆 {offer.depart_details[0].date_depart} → {offer.depart_details[0].date_retour}

        </Typography>
        <CardContent orientation="horizontal">
        <Chip component="span" size="sm" variant="soft" color="success">
        a partire de 👉
            </Chip>
        
        <Typography
          level="title-lg"
          
          sx={{ fontSize:'20px' }}
        >
          {offer.depart_details[0].prix}<span style={{ fontSize: '10px', marginLeft: '4px' }}>MAD</span>
        </Typography>
        </CardContent>

      </>
    )}
      </CardContent>
      <CardOverflow>
      <Divider inset="context"/>
        <CardContent orientation="horizontal">
        {offer.depart_details.length > 0 && (
          <>
          
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
            startDecorator={<GroupsIcon sx={{ color: '#C70039', fontSize: 18 }}/>}
          >
            {offer.depart_details[0].places_total}
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
            startDecorator={<UpdateIcon sx={{ color: '#C70039', fontSize: 18 }}/>}
          >
                      
                        {Math.ceil(
                          (new Date(offer.depart_details[0].date_retour) - new Date(offer.depart_details[0].date_depart)) 
                          / (1000 * 60 * 60 * 24)
                        )} jours
                      
          </Typography>
          <Divider orientation="vertical" />
          </>

        )}
        <Button variant="plain" color="danger" size="sm" endDecorator={<ArrowOutwardIcon />} onClick={() => navigate(`/offre/${offer.slug}`)}>
          Voir l'offre
        </Button> 
        </CardContent>

      </CardOverflow>
    </Card>

     
      </Grid>
    ))}
  </Grid>
</Box>
<Footer/>
    </Box>
  );
}
