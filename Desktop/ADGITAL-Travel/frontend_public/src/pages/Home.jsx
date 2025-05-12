import React, { useEffect, useState,useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardCover, CardContent,CardOverflow ,AspectRatio ,Avatar  ,Stack} from '@mui/joy';
import Tooltip from '@mui/joy/Tooltip';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { TextField  } from '@mui/material';
import IconButton from '@mui/joy/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchPopularOffers, fetchPopularDestinations,getHotels } from '../api/api';
import SousNavbar from '../components/SousNavbar';
import ExploreIcon from '@mui/icons-material/Explore';
import WineBarIcon from '@mui/icons-material/WineBar';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import UpdateIcon from '@mui/icons-material/Update';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import BathtubIcon from '@mui/icons-material/Bathtub';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import AboutSection from '../components/AboutSection';
const reviews = [
  {
    id: 1,
    name: 'Sophie Dupont',
    avatar: 'https://i.pravatar.cc/150?img=3',
    review: "Un service exceptionnel ! L'organisation de notre voyage à Marrakech a été parfaite. Merci à toute l'équipe !",
  },
  {
    id: 2,
    name: 'Karim El Hadi',
    avatar: 'https://i.pravatar.cc/150?img=5',
    review: "Professionnalisme et gentillesse. Je recommande vivement cette agence de voyages pour des vacances sans stress.",
  },
  {
    id: 3,
    name: 'Emma Martin',
    avatar: 'https://i.pravatar.cc/150?img=7',
    review: "Très bonne expérience ! Les destinations proposées sont variées et les conseils sont précieux. À refaire !",
  },
];
export default function Home() {
  const [popularOffers, setPopularOffers] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef();


  useEffect(() => {
    const loadData = async () => {
      const popularOffersData = await fetchPopularOffers();
      const popularDestinationsData = await fetchPopularDestinations();
      const data = await getHotels();
      setHotels(Array.isArray(data) ? data : []);
      setPopularOffers(popularOffersData);
      setPopularDestinations(popularDestinationsData);
    };

    loadData();
  }, []);

  return (
<Box sx={{ overflowX: 'hidden' }}>

  

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
      packages
    </span>&nbsp;exceptionnels !
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
    {popularOffers.map((offer, i) => (
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
        <Button sx={{backgroundColor:'#ff5959'         , '&:hover': {
            backgroundColor: '#C70039', // Changer la couleur de fond au survol
            color: '#fff',              // Texte blanc au survol
            transform: 'scale(1.05)',    // Légère agrandissement au survol
          },}} size="sm" endDecorator={<ArrowOutwardIcon />} onClick={() => navigate(`/offre/${offer.slug}`)}>
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
<Divider sx={{pt: 5,}}>
<Stack
    direction="row"
    spacing={1}
    alignItems="center"
    justifyContent="center"
    sx={{ p: 1, pt: 0 }} // pt = paddingTop (au moins 50px)
  >
    
    <HotelIcon sx={{ color: '#C70039', fontSize: 30 }} />
    <Typography
      level="h2"
      sx={{
        fontWeight: 'bold',
        color: '#070046',
        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
      }}
    >
      Hotels populaires
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
  <Grid container spacing={2} p={4} >
      {hotels.map((hotel) => (
        <Grid xs={12} sm={6} md={4} key={hotel.id} >
          <Card variant="outlined" sx={{maxWidth:300 }}>
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

  <Box
    sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      px: 1.5,
    }}
  >
        <FavoriteIcon fontSize="small"  sx={{ color:"#fff"}}/>
  </Box>
              </AspectRatio>
            </CardOverflow>
            <CardContent>
            <Typography level="body1" sx={{ fontWeight: 'bold' }} color="danger">
             {hotel.nom}
            </Typography>
            <Typography
  level="body2"
  fontSize="sm"
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    minHeight: '24px',         // assure une hauteur minimale
    lineHeight: 1,             // garde le texte sur une seule ligne
    overflow: 'hidden',        // évite les débordements
    whiteSpace: 'nowrap',      // empêche le retour à la ligne
    textOverflow: 'ellipsis',  // ajoute "..." si le texte dépasse
  }}
>
  <LocationOnIcon fontSize="small" />
  {hotel.adresse}
</Typography>

              {/* <Typography mt={1} fontSize="sm">{hotel.description}</Typography> */}
              <Chip variant="soft" color="success" size="lg">
                A partir de {hotel.prix_init} MAD
            </Chip>
            </CardContent>
            <CardOverflow>
            <Divider inset="context" />
        <CardContent orientation="horizontal">
          <>
          
          <Box
    sx={{
      borderRadius: '50%',
      m: 0.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <BathtubIcon sx={{ color: '#C70039', fontSize: 12 }} />
  </Box>

  <Box
    sx={{
      borderRadius: '50%',
      m: 0.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <RoomServiceIcon sx={{ color: '#C70039',fontSize: 12 }} />
  </Box>


  <Box
    sx={{
      borderRadius: '50%',
      m: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <DryCleaningIcon sx={{ color: '#C70039', fontSize: 12 }} />
  </Box>
          <Divider orientation="vertical" />
          </>


        <Button variant="solid" color="danger" size="sm" sx={{fontSize: 15 ,width:'100%'}} endDecorator={<ArrowOutwardIcon sx={{fontSize: 15 }} />} onClick={() => navigate(`/hotels/${hotel.id}`)}>
                 Réserver
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
  onClick={() => navigate('/Hotels')}
>
  Plus d'Hotel
</Button>
  <Divider sx={{pt: 5,}}>
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    justifyContent="center"
    sx={{ p: 1, pt: 0 }} 
  >
    <ExploreIcon sx={{ color: '#C70039', fontSize: 30 }} />
    <Typography
      level="h2"
      sx={{
        fontWeight: 'bold',
        color: '#070046',
        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
      }}
    >
      Destinations populaires
    </Typography>
  </Stack>
  </Divider>
  
  <Box
  sx={{
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    px: 2,
    py: 4,
    position: 'relative',
    
  }}
>

  <Box
    sx={{
      display: 'flex',
      gap: 2,
      minWidth: '100%',
      width: 'max-content',
    }}
  >

    {popularDestinations.map((destination, i) => (
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
    ))}
  </Box>
</Box>

      <Divider>
  <Stack
  direction="row"
  spacing={1}
  alignItems="center"
  justifyContent="center"
  sx={{ p: 2 }}
>
  <FavoriteIcon sx={{ color: '#C70039', fontSize: 30 }} />
  <Typography
    level="h2"
    fontSize="xl2"
    sx={{
      fontWeight: 'bold',
      color: '#070046',
    }}
  >
    Avis de nos visiteurs
  </Typography>
</Stack>
</Divider>

    <Box sx={{ py: 8, px: 3, backgroundColor: '#f9f9f9' }}>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          justifyItems: 'center',
        }}
      >
        {reviews.map((review) => (
          <Card
            key={review.id}
            variant="outlined"
            sx={{
              width: '100%',
              maxWidth: 340,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: 'lg',
              },
              backgroundColor: '#fff',
              borderColor: '#C70039',
              borderWidth: 1,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar src={review.avatar} size="lg" />
                <Typography level="title-md" fontWeight="md">
                  {review.name}
                </Typography>
              </Box>
              <Box display="flex" alignItems="start" gap={1}>
                <FormatQuoteIcon sx={{ color: '#C70039', fontSize: 30 }} />
                <Typography level="body-md" fontStyle="italic">
                  {review.review}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>


    <AboutSection/>
   
<Grid
  container
  spacing={6}
  mt={0}
  alignItems="center"
>
  <Grid item xs={12} md={6}>
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(255, 240, 243, 0.75) 0%, rgba(255, 229, 236, 0.75) 100%)', 
        boxShadow: '0 8px 24px rgba(199, 0, 57, 0.15)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography level="h3" fontWeight="bold" color="#C70039" gutterBottom>
         TravelDemo
        </Typography>

        <Typography fontSize="sm" color="text.secondary" mb={2}>
          Nos partenaires locaux et internationaux nous permettent de vous garantir les meilleurs prix et
          des expériences uniques ... et bien plus encore !
        </Typography>

        <Typography fontSize="sm" color="text.secondary" mb={3}>
          🔥 <strong>Offre spéciale : </strong> Réservez maintenant et bénéficiez jusqu’à <strong>-30% sur nos séjours tout compris</strong> !
          Offre valable jusqu’au <strong>30 mai 2026</strong>.
        </Typography>
      </Box>

      <Button
        variant="solid"
        size="lg"
        sx={{
          backgroundColor: '#C70039',
          color: '#fff',
          borderRadius: 'xl',
          fontWeight: 'bold',
          px: 4,
          py: 1.5,
          '&:hover': {
            backgroundColor: '#a0002e',
          },
        }}
      >
        Explorer nos offres
      </Button>
    </Box>
  </Grid>

  <Grid item xs={12} md={6}>
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(240, 244, 248, 0.75)', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        height: '100%',
      }}
    >

      <Box
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          height: '300px',  
          width: '100%',     
        }}
      >
        <iframe
          title="Travel For You Agadir - Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.842321911671!2d-6.841650184799785!3d34.020882526954566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76c79f4aeda6f%3A0x2bd40e408adfa87d!2sRabat!5e0!3m2!1sfr!2sma!4v1715513148499!5m2!1sfr!2sma"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Box>
  </Grid>
</Grid>
<Footer/>
</Box>
  );
}
