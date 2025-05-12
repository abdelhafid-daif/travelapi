import { data, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardOverflow , CardContent ,AspectRatio,Chip  ,Stack,Divider} from '@mui/joy';
import Tooltip from '@mui/joy/Tooltip';
import IconButton from '@mui/joy/IconButton';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import Navbar from '../components/Navbar';
import SousNavbar from '../components/SousNavbar';
import GroupsIcon from '@mui/icons-material/Groups';
import UpdateIcon from '@mui/icons-material/Update';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Footer from '../components/Footer';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


const OffresParCategoriePage = () => {
  const { id } = useParams(); // catId passé dans l'URL
  const [offres, setOffres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/offres-cat/?categorie=${id}`)
      .then(res => setOffres(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <Box>
   <Navbar />
<Box
  sx={{
    position: 'relative',
    height: { xs: '400px', sm: '500px', md: '600px' },
    width: '100%',
    backgroundImage: 'url("/background.png")',
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
    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.8rem', lg: '4rem' },
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
Votre prochain voyage commence ici
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
      {offres[0]?.categorie.nom}
    </span>&nbsp;packages exceptionnels !
  </Typography>
</Stack>

</Divider>
    <Box p={4}>
      <Grid container spacing={2}>
      {offres.map((offer, i) => (
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
    <Button
  endDecorator={<KeyboardArrowRight sx={{ fontSize: '1.2rem' }} />}
  sx={{
    backgroundColor: 'transparent',
    color: '#C70039',
    border: '2px solid #C70039', // Bordure moderne
    padding: '10px 20px ',         // Espacement interne plus grand pour un effet moderne
    borderRadius: '30px',         // Coins arrondis pour un style plus doux
    fontWeight: 'bold',           // Texte en gras
    textTransform: 'uppercase',   // Texte en majuscules pour un style plus fort
    transition: 'all 0.3s ease',  // Transition fluide sur les effets
    '&:hover': {
      backgroundColor: '#C70039', // Changer la couleur de fond au survol
      color: '#fff',              // Texte blanc au survol
      transform: 'scale(1.05)',    // Légère agrandissement au survol
    },
    display: 'flex',              // Utilisation de flex pour une disposition alignée
    alignItems: 'center',        // Alignement vertical pour l'icône et le texte
    justifyContent: 'center',    // Centrer horizontalement
    margin: '0 auto',             // Centrer horizontalement
    fontSize: '1rem',             // Taille de police légèrement ajustée
  }}
  variant="plain"
  onClick={() => navigate('/Offres')}
>
  Plus d'Offres
</Button>
    <Footer/>
    </Box>
  );
};

export default OffresParCategoriePage;
