import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelById } from '../api/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Chip,
  Divider,
  Button,
  Stack,
} from '@mui/joy';
import Tooltip from '@mui/joy/Tooltip';
import {
  Input,
  Textarea,
  Select, Option,
} from '@mui/joy';
import {
  Person,
  Email,
  Phone,
  PeopleAlt,
  ChatBubbleOutline,
} from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import BedIcon from '@mui/icons-material/Bed';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';
import ReservationHotel from '../components/ReservationHotel';
import PaymentMethodSelect from '../components/PaymentMethodSelect';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [selectedChambreId, setSelectedChambreId] = useState(null);
  const selectedChambre = hotel?.chambres?.find((c) => c.id === selectedChambreId);
  const navigate = useNavigate();



  const handleSelect = (id) => {
    setSelectedChambreId(id);
  };

  useEffect(() => {
    const fetchHotel = async () => {
      const data = await getHotelById(id);
      setHotel(data);
    };
    fetchHotel();
  }, [id]);

  if (!hotel) return <Typography>Chargement...</Typography>;

  return (
    <Box>
    <Navbar />

    <Box sx={{ p: { xs: 0, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
     <Typography
    level="h2"
    sx={{
      pt: 7,
      fontWeight: 'bold',
      color: '#070046',
      fontFamily: "'Funnel Display', bold",
      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
    }}
  >
    Profitez de Réserver à&nbsp;
    <span
      style={{
        fontFamily: "'Funnel Display', bold",
        color: '#C70039',
        fontWeight: 'bold',
      }}
    >
      {hotel.nom}
    </span>&nbsp;À partir de     <span
      style={{
        fontFamily: "'Funnel Display', bold",
        color: '#1c9900',
        fontWeight: 'bold',
      }}
    > {hotel.prix_init}</span>  MAD!
  </Typography>

       <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
            {hotel.images && hotel.images.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 300,  // Ajuste la taille en fonction de l'usage
                  borderRadius: 'lg',
                  overflow: 'hidden',
                  boxShadow: 'sm',
                  mb:1,
                }}
              >
                <AspectRatio ratio="16/9">
                  <img
                    src={hotel.images[2].image_url}
                    alt="hotel-first-image"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AspectRatio>
              </Box>
            )}
                        {/* Carrousel des images */}
                        <Box sx={{ overflowX: 'auto', display: 'flex', gap: 2, pb: 2 }}>
                            {hotel.images?.map((img, index) => (
                            <Box
                                key={index}
                                sx={{
                                flex: '0 0 auto',
                                width: 300,
                                borderRadius: 'lg',
                                overflow: 'hidden',
                                boxShadow: 'sm',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                                }}
                            >
                                <AspectRatio ratio="16/9">
                                <img src={img.image_url} alt={`hotel-${index}`} loading="lazy" />
                                </AspectRatio>
                            </Box>
                            ))}
                        </Box>

                        {/* Informations principales */}
                        <Box mt={3}>
                            <Typography level="h2" fontWeight="xl" color="danger">{hotel.nom}</Typography>
                            <Typography level="body1" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <LocationOnIcon fontSize="small" /> &nbsp; {hotel.adresse}
                            </Typography>
                            <Box mt={1} display="flex" gap={2}>
                            <Chip variant="soft" color="warning">{hotel.etoiles} Étoiles</Chip>
                            <Chip variant="soft" color="success">À partir de {hotel.prix_init} MAD</Chip>
                            <Chip variant="soft" color="neutral">{hotel.destinations_ville}, {hotel.destinations_pays}</Chip>
                            </Box>
                            <Typography mt={2}>{hotel.description}</Typography>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Liste des chambres */}
                        <Typography level="h4" mb={2}><HotelIcon /> &nbsp;Chambres disponibles</Typography>

                        <Box mt={4}>
                    <Grid container spacing={3}>
      {hotel.chambres?.map((chambre) => {
        const isSelected = selectedChambreId === chambre.id;

        return (
          <Grid key={chambre.id} xs={12} sm={6} md={4}>
            <Card
              variant={isSelected ? 'soft' : 'outlined'}
              color={isSelected ? 'primary' : 'neutral'}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: chambre.est_disponible ? 'pointer' : 'not-allowed',
                borderColor: isSelected ? 'primary.outlinedBorder' : undefined,
                boxShadow: isSelected ? 'md' : undefined,
              }}
              onClick={() => chambre.est_disponible && handleSelect(chambre.id)}
            >
              <CardContent>
                <Typography level="h5" fontWeight="lg">
                  Chambre #{chambre.numero}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <BedIcon fontSize="small" />
                  <Typography fontSize="sm">
                    Type : <b>{chambre.type_chambre}</b>
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PersonIcon fontSize="small" />
                  <Typography fontSize="sm">
                    Capacité : {chambre.capacite} {chambre.capacite > 1 ? 'personnes' : 'personne'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <MoneyIcon fontSize="small" />
                  <Typography fontSize="sm">
                    Prix / nuit : <b>{chambre.prix_par_nuit} MAD</b>
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {chambre.est_disponible ? (
                    <>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography fontSize="sm" color="success">Disponible</Typography>
                    </>
                  ) : (
                    <>
                      <CancelIcon fontSize="small" color="danger" />
                      <Typography fontSize="sm" color="danger">Indisponible</Typography>
                    </>
                  )}
                </Box>
              </CardContent>

              <CardOverflow>

                <Button
                  variant={isSelected ? 'solid' : 'outlined'}
                  color="primary"
                  fullWidth
                  disabled={!chambre.est_disponible}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(chambre.id);
                  }}
                >
                  {isSelected ? 'Sélectionnée' : 'Réserver'}
                </Button>
              </CardOverflow>
            </Card>
          </Grid>
        );
      })}
    </Grid>
                    </Box>

                        <Divider sx={{ my: 4 }} />

                        <Box mt={4}>
                    <Typography level="h4">📍 Localisation de l’hôtel</Typography>
                    <Box mt={2} borderRadius="lg" overflow="hidden" height={300}>
                        <MapContainer
                        center={[hotel.latitude, hotel.longitude]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker position={[hotel.latitude, hotel.longitude]}>
                            <Popup>
                            <strong>{hotel.nom}</strong><br />
                            {hotel.adresse}
                            </Popup>
                        </Marker>
                        </MapContainer>
                    </Box>
                    </Box>
                    </Grid>


                    <Grid item xs={12} md={4}>
                        <Box sx={{ position: 'sticky', top: 100 }}>
                            {selectedChambre ? (
                            <ReservationHotel
                                chambre={selectedChambre}
                                onBack={() => setSelectedChambreId(null)}
                                onSubmit={(reservationData) => {
                                console.log("À envoyer à l’API :", reservationData);
                                setSelectedChambreId(null);
                                }}
                            />
                            ) : (
                              <>
                              
                            <Typography level="body1" color="neutral">
                                Sélectionnez une chambre pour réserver.
                            </Typography>
                            <Tooltip title="Sélectionnez une chambre pour réserver." color="danger" variant="outlined">

                              <Card
                              variant="soft"
                              sx={{
                                width: { xs: '100%', md: 400 },
                                mx: 'auto',
                                p: 3,
                                boxShadow: 6,
                                bgcolor: 'background.level1', borderRadius: 'lg'
                              }}
                              
                            >
                              <CardContent>
                              <Box
                              sx={{
                                backgroundColor: '#fff', // rose très clair
                                borderRadius: 2,
                                paddingY: 1.5,
                                paddingX: 2,
                                mb: 3,
                                border: '1px solid transparent',
                              }}
                            >
                              <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="#C70039"
                                textAlign="center"
                              >
                                Réservation Rapide
                              </Typography>
                            </Box>
                            
                                <Divider sx={{ mb: 1 }} />
                            
                                <form >
                                  <Stack spacing={2}>
                                    <Input
                                      startDecorator={<Person sx={{ color: '#C70039' }} />}
                                      placeholder="Nom complet"
                                      variant="outlined"
                                      disabled
                                      required
                                    />
                                    <Input
                                      startDecorator={<Email sx={{ color: '#C70039' }} />}
                                      placeholder="Adresse email"
                                      type="email"
                                      variant="outlined"
                                      disabled
                                      required
                                    />
                                    <Input
                                      startDecorator={<Phone sx={{ color: '#C70039' }} />}
                                      placeholder="Téléphone"
                                      type="tel"
                                      variant="outlined"
                                      disabled
                                      required
                                    />
                                    <Input
                                      startDecorator={<PeopleAlt sx={{ color: '#C70039' }} />}
                                      placeholder="Nombre de personnes"
                                      type="number"
                                      variant="outlined"
                                      disabled
                                      required
                                    />
                                    <Textarea
                                      minRows={3}
                                      placeholder="Message (facultatif)"
                                      variant="outlined"
                                      disabled
                                      startDecorator={<ChatBubbleOutline sx={{ color: '#C70039' }} />}
                                    />
                            
                                    <PaymentMethodSelect  />
                            
                                    <Button
                                      type="submit"
                                      fullWidth
                                      disabled
                                      sx={{
                                        background: 'linear-gradient(to right, #C70039, #a0002a)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        py: 1.2,
                                        borderRadius: 3,
                                        '&:hover': {
                                          background: 'linear-gradient(to right, #a0002a, #C70039)',
                                        },
                                      }}
                                    >
                                      🐎 Réserver maintenant
                                    </Button>

                                  </Stack>
                                </form>
                              </CardContent>
                            </Card>
                            </Tooltip>
                            </>

                            )}
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
  onClick={() => navigate('/Hotels')}
>
  Plus d'Hotel
</Button>
        <Footer/>
    </Box>
  );
};

export default HotelDetails;
