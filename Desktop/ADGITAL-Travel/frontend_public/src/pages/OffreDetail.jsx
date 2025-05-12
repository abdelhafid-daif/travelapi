import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardCover,
  Sheet,
  Stack,
  Chip,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  Option,
  CardContent,
} from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ReservationCard from '../components/ReservationCard';
import GalerieImages from '../components/GalerieImages';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import GroupsIcon from '@mui/icons-material/Groups';
import UpdateIcon from '@mui/icons-material/Update';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Divider from '@mui/joy/Divider';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Footer from '../components/Footer';

const OffreDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [offre, setOffre] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    nombre_personnes: 1,
    message: '',
    methode: 'carte_bancaire',
  });
  const [messageSuccess, setMessageSuccess] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/offres/${slug}/`)
      .then((res) => setOffre(res.data))
      .catch((err) => console.error(err));
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingRes = await axios.post('http://localhost:8000/api/bookings/', {
        ...formData,
        offre: offre.id,
      });
      await axios.post('http://localhost:8000/api/payments/', {
        booking: bookingRes.data.id,
        methode: formData.methode,
      });
      setMessageSuccess('Réservation et paiement enregistrés avec succès !');
    } catch (error) {
      console.error(error);
    }
  };

  if (!offre) return <div>Chargement...</div>;

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: { xs: 0, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={4} sx={{pt:7}}>
          <Grid item xs={12} md={8}>
            <Box sx={{ bgcolor: 'background.level1', borderRadius: 'lg', p: 2 }}>
            <LoyaltyIcon sx={{ color: '#C70039', fontSize: 30 }} />
              <Typography
    level="h2"
    sx={{
      pt: 2,
      pb:2,
      fontWeight: 'bold',
      color: '#070046',
      fontFamily: "'Funnel Display', bold",
      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
    }}
  >
    Profitez packages tour &nbsp;
    <span
      style={{
        fontFamily: "'Funnel Display', bold",
        color: '#C70039',
        fontWeight: 'bold',
      }}
    >
      {offre.titre}
    </span>&nbsp;À partir de    {offre.depart_details.map((d, i) => ( <span
      style={{
        fontFamily: "'Funnel Display', bold",
        color: '#1c9900',
        fontWeight: 'bold',
      }}
    > {Number(d.prix).toLocaleString()}</span>))}  MAD!  
  </Typography>

              <Box
                component="img"
                src={offre.image_principale}
                alt={offre.titre}
                sx={{
                  width: '100%',
                  borderRadius: 'lg',
                  maxHeight: 350,
                  objectFit: 'cover',
                  mb: 2,
                }}
              />
                      <CardContent orientation="horizontal">
        {offre.depart_details.length > 0 && (
          <>
          
          <Typography
            level="body"
            textColor="text.secondary"
            sx={{ fontWeight: 'lg',m:1,p:1,fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' } }}
            startDecorator={<GroupsIcon sx={{ color: '#C70039', fontSize: 20 }}/>}
          >
           places : {offre.depart_details[0].places_total}  
          </Typography>
          <Typography
            level="body"
            textColor="text.secondary"
            sx={{ fontWeight: 'lg' ,m:1,p:1, fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' }}}
            startDecorator={<UpdateIcon sx={{ color: '#C70039', fontSize: 20 }}/>}
          >
                      
                        {Math.ceil(
                          (new Date(offre.depart_details[0].date_retour) - new Date(offre.depart_details[0].date_depart)) 
                          / (1000 * 60 * 60 * 24)
                        )} jours
                      
          </Typography>
          </>

        )}
        </CardContent>

              <Typography mb={3} level="body-md" sx={{ color: 'neutral.700' }}>
                {offre.description}
              </Typography>

              <Typography level="h4" mb={1}>
                Départ
              </Typography>
              <Stack spacing={2}>
  {offre.depart_details.map((d, i) => (
    <Sheet
      key={i}
      variant="soft"
      sx={{
        p: 2,
        borderRadius: 'lg',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 1,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box>
        <Typography fontWeight="bold" color="primary" mb={0.5}>
          📅 {d.date_depart} → {d.date_retour}
        </Typography>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: '#2e7d32',
            mt: 0.5,
          }}
        >
          <CurrencyExchangeIcon sx={{ mr: 0.5 }} fontSize="small" />
          {Number(d.prix).toLocaleString()} MAD
        </Typography>
      </Box>
      <Chip
        size="sm"
        variant="solid"
        color={
          d.statut === 'ouvert'
            ? 'success'
            : d.statut === 'complet'
            ? 'danger'
            : 'warning'
        }
        sx={{ fontWeight: 'bold' }}
      >
        {d.statut.toUpperCase()}
      </Chip>
    </Sheet>
  ))}
</Stack>
{offre.plannings?.length > 0 && (
  <Box mt={6}>
    <Typography
      variant="h4"
      fontWeight="bold"
      textAlign="center"
      mb={5}
      sx={{ color: 'primary.main' }}
    >
       Planning détaillé du séjour
    </Typography>

    <Stack spacing={5}>
      {offre.plannings.map((plan, index) => (
        <Grid
          container
          key={index}
          spacing={4}
          direction={index % 2 === 0 ? 'row' : 'row-reverse'}
          alignItems="center"
        >
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={plan.image}
              alt={`Jour ${plan.jour}`}
              sx={{
                width: '100%',
                height: { xs: 240, sm: 300 },
                borderRadius: 4,
                objectFit: 'cover',
                boxShadow: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)',
                boxShadow: 2,
                borderLeft: '5px solid #C70039',
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ color: 'text.primary' }}
              >
                 Jour {plan.jour} – {plan.titre}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {plan.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Stack>
  </Box>
)}
{offre.extras.length > 0 && (
  <Box mt={6}>
    <Typography
      variant="h4"
      fontWeight="bold"
      textAlign="center"
      mb={3}
      sx={{ color: 'primary.main' }}
    >
      🎁 Options supplémentaires
    </Typography>

    <Stack spacing={2}>
      {offre.extras.map((e, i) => (
        <Sheet
          key={i}
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 'lg',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'background.level1',
            boxShadow: 'sm',
          }}
        >
          <Box>
            <Typography fontWeight="medium" fontSize="1.1rem">
              {e.nom}
            </Typography>
            <Typography fontSize="0.95rem" color="text.secondary">
              💰 {Number(e.prix).toLocaleString('fr-MA')} MAD
            </Typography>
          </Box>

          {e.obligatoire && (
            <Chip size="sm" variant="solid" color="danger">
              Obligatoire
            </Chip>
          )}
        </Sheet>
      ))}
    </Stack>
  </Box>
)}


                  

                    
                    <GalerieImages images={offre.images} titre={offre.titre} />
                  
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <ReservationCard 
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              depart={offre}/>
            </Box>
          </Grid>
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

export default OffreDetail;
