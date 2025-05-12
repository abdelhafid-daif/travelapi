import React, { useState ,useEffect} from 'react';
import { TextField, Button, Box, Typography , 
    CircularProgress, InputLabel, FormControl,Dialog, DialogActions, DialogContent, Grid ,Stack} from '@mui/material';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Input from '@mui/joy/Input';
import Card from '@mui/joy/Card';
import Modal from '@mui/joy/Modal';
import CardContent from '@mui/joy/CardContent';
import { fetchReservations,updateReservations,createFacture } from '../../api/hotels';
import Sidebar from '../../components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Tooltips from '@mui/joy/Tooltip';
import IconButton from '@mui/material/IconButton';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
  } from 'recharts';
import HotelIcon from '@mui/icons-material/Hotel';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import FactureHotel from './FactureHotel'; 

const ReservationsHotel = () => {
  const [reservations , setReservations]= useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, parStatut: {} });
  const [openModal, setOpenModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [montantTotal, setMontantTotal] = useState('');
  const [statutPaiement, setStatutPaiement] = useState('non_payee');
  const [selectedReservationId, setSelectedReservationId] = useState(null);



  
  useEffect(() => {
    const fetchReservationsData = async () => {
      try {
        const response = await fetchReservations();
        console.log('reservations data', response.data);
        if (Array.isArray(response.data)) {
          const transformedReservations = response.data.map(reservation => ({
            ...reservation,
            client_type: reservation.client?.type_client || '—',
            client_telephone: reservation.client?.telephone || '—',
            hotel_nom: reservation.chambre?.hotel_nom || '—',
            hotel_adresse: reservation.chambre?.hotel_adresse || '—',
            numero_chambre: reservation.chambre?.numero || '—',
            type_chambre: reservation.chambre?.type_chambre || '—',
            prix_par_nuit: reservation.chambre?.prix_par_nuit || '—',
          }));
          setReservations(transformedReservations);
          const total = transformedReservations.length;

          const parStatut = transformedReservations.reduce((acc, res) => {
            const statut = res.statut || 'Inconnu';
            acc[statut] = (acc[statut] || 0) + 1;
            return acc;
          }, {});
        
          setStats({ total, parStatut });
        } else {
          setReservations([]);
          setError("Les données de réservation ne sont pas dans le format attendu.");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Impossible de récupérer les données de réservation. Vérifiez vos permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsData();
  }, []);
  const handleSubmit = async () => {
    try {
      const response = await createFacture(selectedReservation.id, {
        montant_total: montantTotal,
        statut_paiement: statutPaiement,
      });
      console.log('Facture créée avec succès :', response);
      setOpenModal(false);
      // Optionnel : mettre à jour le DataGrid si besoin
    } catch (error) {
      console.error('Erreur lors de la création de la facture :', error.response?.data || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'date_reservation', headerName: 'Date Réservation', width: 120 },
    {
      field: 'client_nom',
      headerName: 'Client Nom',
      width: 80,
    },
    {
      field: 'client_type',
      headerName: 'Type Client',
      width: 80,
    },
    {
      field: 'client_telephone',
      headerName: 'Téléphone',
      width: 100,
    },
    {
      field: 'hotel_nom',
      headerName: 'Hôtel',
      width: 180,
    },
    {
      field: 'hotel_adresse',
      headerName: 'Adresse Hôtel',
      width: 100,
    },
    {
      field: 'numero_chambre',
      headerName: 'N° Chambre',
      width: 80,
    },
    {
      field: 'type_chambre',
      headerName: 'Type',
      width: 80,
    },
    { field: 'date_arrivee', headerName: 'Date Arrivée', width: 100 },
    { field: 'date_depart', headerName: 'Date Départ', width: 100 },
    {
      field: 'prix_par_nuit',
      headerName: 'Prix/Nuit',
      width: 70,
    },
    {
        field: 'get_nuits',
        headerName: 'Nuits',
        width: 70,
      },
      {
        field: 'get_total',
        headerName: 'Total',
        width: 70,
      },

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
    
          return <Chip label={label} color={color} size="small" />;
        }
      },
      {
        field: 'action',
        headerName: 'Modifier Statut',
        width: 200,
        renderCell: (params) => {
          const handleChange = async (_, newValue) => {
            try {
              const response = await updateReservations(params.row.id, { statut: newValue });
              console.log('Réponse du serveur:', response);
              // Mettre à jour la ligne localement dans le DataGrid
              params.api.updateRows([{ id: params.row.id, statut: newValue }]);
            } catch (error) {
              console.error('Erreur lors de la mise à jour du statut', error);
              console.error('Réponse d\'erreur:', error.response?.data || error.message);
            }
          };
      
          return (
            <Select
              value={params.row.statut || ''}
              onChange={handleChange}
              color="primary"
              variant="soft"
              size="sm"
            >
              <Option value="en_attente">En attente</Option>
              <Option value="confirmee">Confirmée</Option>
              <Option value="annulee">Annulée</Option>
            </Select>
          );
        }
      },
      {
        field: 'facture',
        headerName: 'Facture',
        width: 100,
        renderCell: (params) => {
          const hasFacture = Boolean(params.row.facture); // à ajuster selon ton backend
      
          const handleOpenModal = () => {
            setSelectedReservation(params.row); // set in state
            setOpenModal(true);
          };
          if (params.row.has_facture) {
            return (
                <Tooltips title="Facture déjà créée">
                    <IconButton onClick={() => afficherFacture(params.row.id)}>
                      <ReceiptIcon color="disabled" />
                    </IconButton>
                  
               </Tooltips>
            );
          } else {
            return (
            <Tooltips title="Créer une facture">
                <IconButton onClick={handleOpenModal} color="primary" size="sm">
                  <ReceiptIcon />
                </IconButton>
              </Tooltips>
            );
          }
        },
      
    }

  ];
  const afficherFacture = (id) => {
    setSelectedReservationId(id);  // Set the reservationId to the selected one
  };

  return (
    <Sidebar>
    <Box sx={{ padding: 4 }}>
        
        {error && <Typography color="error">{error}</Typography>}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {/* Carte Total */}
                     <Grid item xs={12} sm={6} md={3}>
                          <Card  sx={{ backgroundColor: '#1e88e5', color: '#fff', borderRadius: 10 ,minWidth:'150px'}}>
                              <CardContent>
                              <Stack direction="row" alignItems="center" spacing={1}>
                              <HotelIcon style={{ fontSize: 20, color: '#fff', marginRight: 10 }} />
                                <Typography variant="subtitle1">Total </Typography>
                              </Stack>

                              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                                <Typography variant="h5" fontWeight="bold">
                                 {stats.total}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                      </Grid>

            {Object.entries(stats.parStatut).map(([statut, count]) => {
                const icon = statut.toLowerCase().includes('confirm') ? <EventAvailableIcon style={{ fontSize: 20, color: '#fff', marginRight: 10 }}/> :
                            statut.toLowerCase().includes('annul') ? <CancelIcon style={{ fontSize: 20, color: '#fff', marginRight: 10 }}/> :
                            <HourglassBottomIcon style={{ fontSize: 20, color: '#fff', marginRight: 10 }} />;
                const color = statut.toLowerCase().includes('confirm') ? 'success' :
                            statut.toLowerCase().includes('annul') ? 'danger' : 'warning';
                return (

                <Grid item xs={12} sm={6} md={3}>
                <Card key={statut}  sx={{ backgroundColor: '#1e88e5', color: '#fff', borderRadius: 10 ,minWidth:'150px'}}>
                    <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1}>
                    {icon}
                      <Typography variant="subtitle1">{statut} </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                      <Typography variant="h5" fontWeight="bold">
                      {count}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
                </Grid>
                );
            })}
            </Box>

            <Box sx={{ flex: 2, width: '100%', overflowX: 'auto' }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <Card sx={{ maxWidth: '1300px' ,minWidth: '600px' }} variant={'soft'} color={'primary'}> 
                <Typography level="title-md" textColor="inherit" gutterBottom>Gestion des Réservations</Typography>
                <DataGrid
                    rows={reservations}
                    columns={columns}
                    autoHeight
                    pageSize={5}
                    getRowId={(row) => row.id}
                />
                </Card>
            )}
            </Box>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 'md', width: 400 }}>
                    <Typography level="h4" mb={2}>Créer une Facture</Typography>
                    <Input
                    placeholder="Montant total"
                    type="number"
                    value={montantTotal}
                    onChange={(e) => setMontantTotal(e.target.value)}
                    />
                    <Select
                    value={statutPaiement}
                    onChange={(e, val) => setStatutPaiement(val)}
                    sx={{ mt: 2 }}
                    >
                    <Option value="non_payee">Non payée</Option>
                    <Option value="payee">Payée</Option>
                    <Option value="partiellement_payee">Partiellement payée</Option>
                    </Select>
                    <Button onClick={handleSubmit} sx={{ mt: 3 }} color="primary">Valider</Button>
                </Box>
            </Modal>
            {selectedReservationId && (
                <FactureHotel reservationId={selectedReservationId} />
            )}
    </Box>
    </Sidebar>
    
  );
};

export default ReservationsHotel;
