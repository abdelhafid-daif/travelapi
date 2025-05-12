import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend, ResponsiveContainer
} from 'recharts';
import { Box, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/joy/Chip';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';
import {getBookingManager} from '../../api/offres';
import {fetchReservations} from '../../api/hotels';
import {getStatsbokmng} from '../../api/part';
import HotelIcon from '@mui/icons-material/Hotel';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Alert from '@mui/joy/Alert';
import Warning from '@mui/icons-material/Warning';
import LinearProgress from '@mui/joy/LinearProgress';

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];
const COLOR = ['#FF9800', '#4CAF50', '#F44336'];

export default function BookingCharts() {
  const [stats, setStats] = useState({ by_statut: [], by_date: [], by_offre: [] });
  const [statuts, setStatuts] = useState({ total: 0, parStatut: {} });
  const [status,setStatus]=useState([]);
  const [bookings, setBookings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);


  

  const getChipColor = (statut) => {
    switch (statut) {
      case 'annulee':
        return 'danger'; // red color for canceled
      case 'en_attente':
        return 'danger'; // orange color for pending
      case 'confirmee':
        return 'success'; // green color for confirmed
      default:
        return 'default';
    }
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'bookings.xlsx');
  };
  const exportDataToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reservations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'reservations.xlsx');
  };
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    getStatsbokmng().then(res => {
        setStats(res.data);
        setStatus(res.data.by_statut);
        console.log('data:', res.data);
      })
      .catch(err => console.error(err));

      const load = async () => {
        try {
          const response = await getBookingManager();
          console.log('data:',response.data);
          setBookings(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
          setError("Erreur lors du chargement des données de réservation.");
        } finally {
          setLoading(false);
        }
      };
      const hotel = async () => {
        try {
          const response = await fetchReservations();
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
              has_facture: reservation.has_facture || false,
            }));
            console.log("Transformed reservations:", transformedReservations);
            setReservations(transformedReservations);
            const total = transformedReservations.length;
  
              const parStatut = transformedReservations.reduce((acc, res) => {
                const statut = res.statut || 'Inconnu';
                acc[statut] = (acc[statut] || 0) + 1;
                return acc;
              }, {});
          
            setStatuts({ total, parStatut });
          } else {
            setReservations([]);
            setError("Les données de réservation ne sont pas dans le format attendu.");
          }
        } catch (err) {
          setError("Erreur lors du chargement des données de réservation.");
        } finally {
          setLoading(false);
        }
      };
      load();
      hotel();
  }, []);
  const columns_offre = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'offre_titre', headerName: 'offre', width: 200 },
    { field: 'nom', headerName: 'Nom', width: 100 },
    { field: 'email', headerName: 'email', width: 150 },
    { field: 'telephone', headerName: 'telephone', width: 150 },
    { field: 'nombre_personnes', headerName: 'nombre_personnes', width: 60 },
    { field: 'date_reservation', headerName: 'date_reservation', width: 200 },
    { field: 'message', headerName: 'message', width: 200 },
    {field: 'statut',headerName: 'Statut', width:200},
    {
      field: 'has_facture',
      headerName: 'Facture',
      width: 140,
      renderCell: (params) => {
        const val = String(params.value);
        console.log("Valeur has_facture dans renderCell :", val);
        if (val === "true") {
          return <span style={{ color: val === 'true' ? 'green' : 'red' }}>{val === 'true' ? 'Confirmée' : 'Pas de Confirmation'}</span>;
        } else if (val === "false") {
          return <span style={{ color: val === 'true' ? 'green' : 'red' }}>{val === 'true' ? 'Confirmée' : 'Pas de Confirmation'}</span>;
        } else {
          return <span>-</span>;
        }
      }
    },
    {
      field: 'numero_facture',
      headerName: 'N°Facture',
      width: 150,
    },
    
  ]
  const columns_hotel = [
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
        field: 'has_facture',
        headerName: 'Facture',
        width: 140,
        renderCell: (params) => {
          const val = String(params.value);
          console.log("Valeur has_facture dans renderCell :", val);
          if (val === "true") {
            return <span style={{ color: val === 'true' ? 'green' : 'red' }}>{val === 'true' ? 'Confirmée' : 'Pas de Confirmation'}</span>;
          } else if (val === "false") {
            return <span style={{ color: val === 'true' ? 'green' : 'red' }}>{val === 'true' ? 'Confirmée' : 'Pas de Confirmation'}</span>;
          } else {
            return <span>-</span>;
          }
        }
      },
      {
        field: 'facture_numero',
        headerName: 'N°Facture',
        width: 150,
      },
  ]


  return (
    <Sidebar>

<Box
      sx={{
        p: 2,
        maxWidth: {
          xs: '100%',   // 100% width on small screens
          sm: '600px',  // 600px max width on small screens and up
          md: '800px',  // 800px on medium screens and up
          lg: '1300px'  // 1000px on large screens and up
        },
        margin: '0 auto'  // Center the Box horizontally
      }}
    >
      <Typography
          level="h3"
          textColor="primary"
          sx={{ textTransform: 'capitalize' }}
        >Statistiques des Réservations 'Offres de Voyage'</Typography>
      <Grid container spacing={3} padding={2}>
      <Card
        invertedColors
        backgroundColor='#fff'
        startDecorator={
            <Warning />
         
        }
        sx={{ alignItems: 'flex-start', gap: '1rem' }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography level="title-md">Statut de Réservation</Typography>
          <Typography level="body-md">
          Veuillez vérifier les détails et passer l'ordre pour que le staff finalise la confirmation des réservations.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {status.map((item, index) => (
            <Chip
              key={index}
              color={getChipColor(item.statut)}
              variant="solid"
              width="auto"
            >{`${item.statut} (${item.count})`}</Chip>
         ))} 
          </Box>
        </Box>
      </Card>

       </Grid>
    
      <Grid container spacing={3} padding={2}>
      <Card variant={'soft'} color={'primary'} sx={{ minWidth: 300 , backgroundColor:"#fff" }}>
        <Typography
          level="title-md"
          textColor="inherit"
          sx={{ textTransform: 'capitalize' }}
        >
          par statut de Réservation
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={stats.by_statut}
              dataKey="count"
              nameKey="statut"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={15}
              cornerRadius={5}
              startAngle={0}
              endAngle={380}
              cx={150}
              cy={150}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {stats.by_statut.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLOR[index % COLOR.length]}
                />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

        <Card variant={'soft'} color={'primary'} sx={{ minWidth: 543,backgroundColor:"#fff"  }}>
        <Typography
          level="title-md"
          textColor="inherit"
          sx={{ textTransform: 'capitalize' }}
        >Par Date de Réservation</Typography>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={stats.by_date}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#1976d2" />
                </LineChart>
              </ResponsiveContainer>
        </Card>


        <Card variant={'soft'} color={'primary'} sx={{ minWidth: 343,backgroundColor:"#fff"  }}>
        <Typography
          level="title-md"
          textColor="inherit"
          sx={{ textTransform: 'capitalize' }}
        >Par Offre</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.by_offre} >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="offre__titre" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#2196f3" borderRadius={10} />
                </BarChart>
              </ResponsiveContainer>
        </Card>
    </Grid>
    {loading ? (
             <CircularProgress />
           ) : (
            <>
            <Button variant="soft" color="success" startDecorator={<SaveAltIcon />}onClick={exportToExcel}>
              Exporter en Excel
            </Button>
            <DataGrid
                rows={bookings}
                columns={columns_offre}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowHeight={() => 'auto'}
                showCellVerticalBorder
                showColumnVerticalBorder
                checkboxSelection
                disableSelectionOnClick
            />
            </>
            
          )}
          <LinearProgress color="danger" />
    <Typography
          level="h3"
          textColor="primary"
          sx={{ textTransform: 'capitalize' }}
        >Statistiques des Réservations 'Hotels'</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {/* Carte Total */}
            <Card variant="soft" color="primary" invertedColors sx={{ width: 200 }}>
                <CardContent orientation="horizontal">
                <HotelIcon sx={{ fontSize: 40 }} />
                <Box sx={{ ml: 2 }}>
                    <Typography level="body-sm">Total</Typography>
                    <Typography level="h4">{statuts.total}</Typography>
                </Box>
                </CardContent>
            </Card>

            {Object.entries(statuts.parStatut).map(([statut, count]) => {
                const icon = statut.toLowerCase().includes('confirm') ? <EventAvailableIcon /> :
                            statut.toLowerCase().includes('annul') ? <CancelIcon /> :
                            <HourglassBottomIcon />;
                const color = statut.toLowerCase().includes('confirm') ? 'success' :
                            statut.toLowerCase().includes('annul') ? 'danger' : 'warning';
                return (
                <Card key={statut} variant="soft" color={color} sx={{ width: 200 }}>
                    <CardContent orientation="horizontal">
                    {icon}
                    <Box sx={{ ml: 2 }}>
                        <Typography level="body-sm">{statut}</Typography>
                        <Typography level="h4">{count}</Typography>
                    </Box>
                    </CardContent>
                </Card>
                );
            })}
            </Box>
    {loading ? (
             <CircularProgress />
           ) : (
            <>
            
            <Button variant="soft" color="success" startDecorator={<SaveAltIcon />} onClick={exportDataToExcel}>
              Exporter en Excel
            </Button>
            <DataGrid
                rows={reservations}
                columns={columns_hotel}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowHeight={() => 'auto'}
                showCellVerticalBorder
                showColumnVerticalBorder
                checkboxSelection
                disableSelectionOnClick
            />
          </>
          )}
        
      </Box>
    </Sidebar>
  );
}
