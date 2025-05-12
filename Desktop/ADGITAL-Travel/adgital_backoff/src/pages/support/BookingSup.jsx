import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getBooking,putBooking} from '../../api/offres'; 
import {  Grid, Box, Typography, CircularProgress ,Divider,Button ,Stack} from '@mui/material';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import SvgIcon from '@mui/joy/SvgIcon';
import { Select, MenuItem } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { Chip } from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
const BookingSup = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

  
    useEffect(() => {
      const fetchBookingData = async () => {
        try {
          const response = await getBooking();
          console.log('booking',response.data);
          setBookings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          setError("Impossible de récupérer data Booking. Vérifiez vos permissions.");
        } finally {
          setLoading(false); 
        }
      };
  
      fetchBookingData();
    }, []);
    const totalCount = bookings.length;
    const enAttenteCount = bookings.filter(b => b.statut === 'en_attente').length;
    const confirmeeCount = bookings.filter(b => b.statut === 'confirmee').length;
    const annuleeCount = bookings.filter(b => b.statut === 'annulee').length;
  
    const columns = [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'offre_titre', headerName: 'offre_titre', width: 200 },
      { field: 'offre', headerName: 'offre_id', width: 80 },
      { field: 'nom', headerName: 'nom', width: 100 },
      { field: 'email', headerName: 'email', width: 100 },
      { field: 'telephone', headerName: 'telephone', width: 100 },
      { field: 'nombre_personnes', headerName: 'nombre_personnes', width: 100 },
      { field: 'date_reservation', headerName: 'date_reservation', width: 100 },
      { field: 'message', headerName: 'message', width: 200 },
      { 
        field: 'statut', 
        headerName: 'Statut', 
        width: 150,
        renderCell: (params) => {
          let color;
          let label;
    
          switch (params.value) {
            case 'en_attente':
              color = 'warning';
              label = 'En attente';
              break;
            case 'confirmee':
              color = 'success';
              label = 'Confirmée';
              break;
            case 'annulee':
              color = 'error';
              label = 'Annulée';
              break;
            default:
              color = 'default';
              label = params.value;
          }
    
          return <Chip label={label} color={color} />;
        }
      },
      {
        field: 'action',
        headerName: 'Modifier Statut',
        width: 200,
        renderCell: (params) => {
          const handleChange = async (event) => {
            const newStatut = event.target.value;
   
            try {
              await putBooking(params.row.id, { statut: newStatut });
              params.api.updateRows([{ id: params.row.id, statut: newStatut }]);
            } catch (error) {
              console.error('Erreur lors de la mise à jour du statut', error);
            }
          };
      
          return (
            <Select
              value={params.row.statut || ''}
              onChange={handleChange}
              size="small"
              fullWidth
            >
              <MenuItem value="en_attente">En attente</MenuItem>
              <MenuItem value="confirmee">Confirmée</MenuItem>
              <MenuItem value="annulee">Annulée</MenuItem>
            </Select>
          );
        }
      },
    ];
  
    return (
      <Sidebar>
         <Typography variant="h4" gutterBottom>
            Réservation Manage
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" gap={4} flexWrap="wrap" padding={2}>
          <Grid container spacing={2} marginBottom={4}>
          <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#17a2b8', color: '#fff', borderRadius: 10 }}>
              <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <DescriptionOutlinedIcon />
                <Typography variant="subtitle1">Totale </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                <Typography variant="h5" fontWeight="bold">
                {totalCount}
                </Typography>
                <Typography variant="subtitle2">Réservations</Typography>
                <ArrowUpwardIcon sx={{ fontSize: 16 }} />
              </Stack>
            </CardContent>
          </Card>

          </Grid>

          <Grid item xs={12} sm={6} md={3} >
          <Card sx={{ backgroundColor: '#dc3545', color: '#fff', borderRadius: 10 }}>
              <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmojiEmotionsIcon />
                <Typography variant="subtitle1">En attente </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                <Typography variant="h5" fontWeight="bold">
                {enAttenteCount}
                </Typography>
                <Typography variant="subtitle2">Réservations</Typography>
                <ArrowUpwardIcon sx={{ fontSize: 16 }} />
              </Stack>
            </CardContent>
          </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#28a745', color: '#fff', borderRadius: 10 }}>
              <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ThumbUpAltIcon />
                <Typography variant="subtitle1">Confirmées </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                <Typography variant="h5" fontWeight="bold">
                {confirmeeCount}
                </Typography>
                <Typography variant="subtitle2">Réservations</Typography>
                <ArrowUpwardIcon sx={{ fontSize: 16 }} />
              </Stack>
            </CardContent>
          </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#6c757d', color: '#fff', borderRadius: 10 }}>
              <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SentimentVeryDissatisfiedIcon />
                <Typography variant="subtitle1">Annulee </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                <Typography variant="h5" fontWeight="bold">
                {annuleeCount}
                </Typography>
                <Typography variant="subtitle2">Réservations</Typography>
                <ArrowUpwardIcon sx={{ fontSize: 16 }} />
              </Stack>
            </CardContent>
          </Card>
          </Grid>
         </Grid>
          <Box display="flex"  minWidth="300px" maxWidth="1300px">

              {loading ? (
                <CircularProgress />
              ) : (
                <DataGrid rows={bookings} columns={columns} autoHeight pageSize={5} />
              )}

          </Box>
        </Box>
      </Sidebar>
    );
  };
  
  export default BookingSup;
  