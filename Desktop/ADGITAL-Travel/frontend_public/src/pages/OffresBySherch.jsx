import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardCover, CardContent ,Stack} from '@mui/joy';
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
import ExploreIcon from '@mui/icons-material/Explore';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

export default function OffresBySherch() {
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
      <SousNavbar />
      {/* Hero section */}


<Box  sx={{ px: 3, pb: 4,p:2 }}>
  <Grid container spacing={3}>
    {offers.map((offer, i) => (
      <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
        <Card
  sx={{
    minHeight: 200,
    width: 300,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 5,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    },
  }}
>
  {/* Image de fond */}
  <CardCover>
    <img src={offer.image_principale} loading="lazy" alt={offer.titre} />
  </CardCover>

  {/* Dégradé sombre pour lisibilité */}
  <CardCover
                sx={{
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                    }}
                />


  {/* Titre en haut */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      px: 2,
      pt: 1.5,
    }}
  >
    <Typography
      level="title-md"
      fontWeight="bold"
      textColor="#fff"
      noWrap
    >
      {offer.titre}
    </Typography>
  </Box>

  {/* Contenu bas */}
  <CardContent sx={{ justifyContent: 'flex-end'}}>
    {offer.destinations.length > 0 && (
      <Typography
        level="body-xs"
        startDecorator={<LocationOnRoundedIcon />}
        textColor="neutral.300"
      >
        {offer.destinations[0].ville}
      </Typography>
    )}
    {offer.depart_details.length > 0 && (
      <>
        <Typography level="body-xs" textColor="neutral.300">
          📆 {offer.depart_details[0].date_depart} → {offer.depart_details[0].date_retour}
        </Typography>
        <Typography
          level="body-sm"
          fontWeight="bold"
          sx={{ mt: 0.5 }}
          textColor="#fff"
        >
          {offer.depart_details[0].prix} MAD
        </Typography>
      </>
    )}

    {/* Icon en bas à droite */}
    <Box
      sx={{
        position: 'absolute',
        bottom: 8,
        right: 8,
      }}
    >
<Tooltip
  title="Voir les détails"
  placement="top-end"
  variant="soft"
  sx={{
    '& .MuiTooltip-tooltip': {
      backgroundColor: '#C70039',
      color: '#fff',
      fontSize: '0.75rem',
      borderRadius: '4px',
    },
    '& .MuiTooltip-arrow': {
      color: '#C70039',
    },
  }}
>
        <IconButton variant="soft" size="sm"   sx={{
        backgroundColor: '#C70039',
        color: '#fff',
        '&:hover': {
        backgroundColor: '#a0002e',
        },
        }}
        onClick={() => navigate(`/offre/${offer.slug}`)}>
        <NewLabelIcon />
      </IconButton>
        </Tooltip>

    </Box>
  </CardContent>
</Card>
     
      </Grid>
    ))}
  </Grid>
</Box>

    </Box>
  );
}
