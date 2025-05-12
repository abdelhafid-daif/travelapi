import { data, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardCover, CardContent ,CardOverflow  ,Stack,Divider} from '@mui/joy';
import AspectRatio from '@mui/joy/AspectRatio';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Chip from '@mui/joy/Chip';
import Footer from '../components/Footer';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import NewLabelIcon from '@mui/icons-material/NewLabel';
import Navbar from '../components/Navbar';
import GroupsIcon from '@mui/icons-material/Groups';
import UpdateIcon from '@mui/icons-material/Update';

const OffresParCategoriePage = () => {
  const { id } = useParams(); // catId passé dans l'URL
  const [offres, setOffres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/offres-dest/?destination=${id}`)
      .then(res => setOffres(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <Box>
    <Navbar />
    <Box p={4} sx={{pt:10}}>
      <Typography level="h3" mb={3}>Offres de la Destination</Typography>
      <Grid container spacing={2}>
      {offres.length > 0 ? (
        offres.map((offer, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
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
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
          Aucune offre disponible pour le moment.
        </Typography>
      )}
      </Grid>
    </Box>
    </Box>
  );
};

export default OffresParCategoriePage;
