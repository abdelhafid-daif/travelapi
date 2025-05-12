import Sidebar from '../components/Sidebar';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Avatar,
  Stack,IconButton

} from '@mui/material';
import axios from 'axios';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import { List, ListItem, ListItemDecorator, Sheet } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Announcement, LocalOffer } from '@mui/icons-material';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip ,
  BarChart, Bar, Legend, ResponsiveContainer
} from 'recharts';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { AttachMoney, CalendarToday, Pageview, ThumbUp } from '@mui/icons-material';
import { fetchPaiementsStats, getStatsbokoff ,getStatsdestoff ,getStatsbokoffdate} from '../api/part';
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TourIcon from '@mui/icons-material/Tour';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const dataPie = [
  { name: 'Youtube', value: 300 },
  { name: 'Facebook', value: 500 },
  { name: 'Twitter', value: 200 },
];
const COLORS = ['#f44336', '#2196f3', '#00bcd4','#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'];
const COLOR = ['#FF9800', '#4CAF50', '#F44336'];


const ManagerDashboard = () => { 
  const [bookingStats, setBookingStats] = useState([]);
  const [destoffStats, setDestoffStats] = useState([]);
  const [destoffdateStats, setDestoffdateStats] = useState({ today: 0, month: 0, year: 0 ,htoday: 0, hmonth: 0, hyear: 0,offres_count:0});
  const [stats, setStats] = useState({
    total_paiements_facture: 0,
    total_paiements_hotel: 0,
    total_hotels: 0,
    total_reservations: 0,
  });
  const [statss, setStatss] = useState({ today: 0, month: 0, year: 0 });
  const [view, setView] = useState('year'); // default
  const [viewh, setViewh] = useState('hyear'); 
  const [charts,setCharts] = useState(null);
  const [status, setStatus] = useState({ by_statut: []});


  useEffect(() => {
    fetchPaiementsStats()
      .then((data) => {
        console.log('data manager dash:', data);
  
        // Sécurité : valeurs par défaut si données absentes
        const safeStats = {
          total_paiements_facture: data.total_paiements_facture ?? 0,
          total_paiements_hotel: data.total_paiements_hotel ?? 0,
          total_hotels: data.total_hotels ?? 0,
          total_reservations: data.total_reservations ?? 0,
          paiements_par_date: Array.isArray(data.paiements_par_date) ? data.paiements_par_date : [],
        };
  
        setStats(safeStats);
        setCharts(safeStats.paiements_par_date);
      })
      .catch((error) =>
        console.error('Erreur lors de la récupération des statistiques:', error)
      );

  

  }, []);
  useEffect(() => {
    getStatsbokoff()
      .then((res) => {
        
        setBookingStats(res.data);
      })
      .catch((err) => console.error('Erreur chargement stats booking:', err));
  }, []);
  useEffect(() => {
    getStatsdestoff()
      .then((res) => {
        
        setDestoffStats(res.data);
      })
      .catch((err) => console.error('Erreur chargement stats booking:', err));
  }, []);
  useEffect(() => {
    getStatsbokoffdate()
      .then(res => {
        console.log('datastat',res.data);
        setDestoffdateStats(res.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des statistiques :', error));
  }, []);
  useEffect(() =>{
    const token = localStorage.getItem('access_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get('http://localhost:8000/booking-stats/', config)
    .then(res => {
      setStatus(res.data);
      console.log('data chart :', res.data);
    })
  },[])


  return(



  <Sidebar>

      <Box sx={{ p: 5 }}>


      <Grid container spacing={2} sx={{justifyContent: 'center',}}>
          <Grid item xs={12} sm={4}  sx={{maxHeight:180}}>
              <Box >
              <Card
                sx={{
                  width: 300,
                  height: 160,
                  backgroundColor: '#1976d2',
                  color: 'white',
                  borderRadius: '20px',
                  boxShadow: 'lg',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 2,
                  position: 'relative'
                }}
              >

                    <CalendarMonthIcon />

                {/* Top right buttons */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  
                <ButtonGroup variant="solid" color="primary" aria-label="solid button group">

                    <Button onClick={() => setView('today')} selected={view === 'today'}>Today</Button>
                    <Button onClick={() => setView('month')} selected={view === 'month'}>Month</Button>
                    <Button onClick={() => setView('year')} selected={view === 'year'}>Year</Button>
                  </ButtonGroup>
                </Box>

                {/* Icon and Count */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                  <Box>
                  <Box
                    sx={{
                      mt: 2,
                    }}
                  >
                      <Typography level="h2" sx={{fontSize:'25px',fontWeight:'bold'}} >{destoffdateStats[view]}</Typography>
                  </Box>
                    
                    <Typography level="body-sm" sx={{ opacity: 0.8 }}>
                      Total Bookings Tours                   <Typography level="body-xs" sx={{ opacity: 0.8 , mt:1 }}>
                    {view === 'today' && new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {view === 'month' && new Date().toLocaleDateString('en-US', { month: 'long' })}
                    {view === 'year' && new Date().getFullYear()}
                  </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1, textAlign: 'center' }}>

                </Box>
              </Card>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{maxHeight:180}}>
              <Box >
              <Card
                sx={{
                  width: 300,
                  height: 160,
                  backgroundColor: '#c62828',
                  color: 'white',
                  borderRadius: '20px',
                  boxShadow: 'lg',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 2,
                  position: 'relative'
                }}
              >

                    <CalendarMonthIcon />

                {/* Top right buttons */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  
                <ButtonGroup  color="danger" variant="solid" aria-label="solid button group">

                    <Button onClick={() => setViewh('htoday')} selected={viewh === 'today'}>Today</Button>
                    <Button onClick={() => setViewh('hmonth')} selected={viewh === 'month'}>Month</Button>
                    <Button onClick={() => setViewh('hyear')} selected={viewh=== 'year'}>Year</Button>
                  </ButtonGroup>
                </Box>

                {/* Icon and Count */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                  <Box>
                  <Box
                    sx={{
                      mt: 2,
                    }}
                  >
                      <Typography level="h2" sx={{fontSize:'25px',fontWeight:'bold'}} >{destoffdateStats[viewh]}</Typography>
                  </Box>
                    
                    <Typography level="body-sm" sx={{ opacity: 0.8 }}>
                      Total Bookings Hôtels                   <Typography level="body-xs" sx={{ opacity: 0.8 ,mt:1}}>
                    {viewh === 'htoday' && new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {viewh === 'hmonth' && new Date().toLocaleDateString('en-US', { month: 'long' })}
                    {viewh === 'hyear' && new Date().getFullYear()}
                  </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1, textAlign: 'center' }}>

                </Box>

              </Card>
              </Box>
            </Grid>
        
              <Grid item xs={12} sm={4}  sx={{maxHeight:180}}>
                  <Grid  spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ margin: 1}}>
                            <Card
                        sx={{
                          width: 300,
                          height: 70,
                          backgroundColor: '#673ab7',
                          color: '#fff',
                          borderRadius: '20px',
                          boxShadow: 'lg',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 0.6,
                          position: 'relative',
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 5, left: 8 ,color: '#fff',}}>
                          <IconButton
                            size="sm"
                            sx={{ color: '#fff'}}
                          >
                            <LocalOfferIcon fontSize="small" />
                            <Typography level="body-sm" sx={{ opacity: 0.8,pl:2 ,color: '#fff'}}>
                            number of Tours on your website
                          </Typography>
                          </IconButton>
                        </Box>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pl: 5 }}>
                          <Typography level="h2" sx={{fontSize:'25px',fontWeight:'bold'}}>
                            {destoffdateStats.offres_count}
                          </Typography>
                        </Box>
                      </Card>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} >
                        <Box sx={{ margin: 1}}>
                            <Card
                              sx={{
                                width: 300,
                                height: 70,
                                backgroundColor: '#d84315',
                                color: '#fff',
                                borderRadius: '20px',
                                boxShadow: 'lg',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                p: 0.6,
                                position: 'relative',
                              }}
                            >
                              <Box sx={{ position: 'absolute', top: 5, left: 8 }}>
                                <IconButton
                                  sx={{ color: '#fff'}}
                                  size="sm"
                                >
                                  <LocalOfferIcon fontSize="small" />
                                  <Typography level="body-sm" sx={{ opacity: 0.8,pl:2 }}>
                                  number of Hotels on your website
                                </Typography>
                                </IconButton>
                              </Box>
                              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pl: 5 }}>
                                <Typography level="h2" sx={{fontSize:'25px',fontWeight:'bold'}}>
                                  {destoffdateStats.hotels_count}
                                </Typography>
                              </Box>
                            </Card>
                        </Box>
                      </Grid>
                   </Grid>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ maxHeight: 160 }}>
  <Card variant="soft" color="primary" sx={{ height: 170,minWidth: 240, p: 1 }}>
  <Typography
          level="title-md"
          sx={{ textTransform: 'capitalize' }}
        >
          par statut de Réservation
        </Typography>
    <ResponsiveContainer width="100%" height={150}>
      <PieChart>
        <Pie
          data={status.by_statut}
          dataKey="count"
          nameKey="statut"
          innerRadius={30}
          outerRadius={45}
          paddingAngle={5}
          cornerRadius={3}
          startAngle={0}
          endAngle={360}
          cx="50%"
          cy="50%"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {status.by_statut.map((entry, index) => (
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
</Grid>

        </Grid>

        <Grid container spacing={2} pt={2}>
            <Grid size={4}>
            <Sheet
              sx={{
                padding: 2,
                boxShadow: 'sm',
                borderRadius: 'md',
                height: '100%',
                maxHeight: 500,
                overflowX: 'auto',
                overflowY: 'auto',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography level="h2" align="center" sx={{ marginBottom: 2, color: '#1976d2' }}>
                Destinations and Their Offres Count
              </Typography>

              <List>
                {destoffStats.map((stat) => (
                  <React.Fragment key={stat.id}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: '#fff',
                        p: 1.5,
                        borderRadius: '8px',
                        boxShadow: 'sm',
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon color="primary" />
                        <Typography sx={{ fontWeight: 500 }}>{stat.pays}-{stat.ville}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {stat.offres_count} Tours
                        </Typography>
                        <TourIcon color="action" />
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Sheet>
            </Grid>
            <Grid size={8}>
            <Card variant="outlined" sx={{ height: '100%',borderRadius: '20px', boxShadow: 'lg', }}>
                <CardContent>
                  <Typography level="h4" sx={{ mb: 2 }}>
                    Nombre de Réservations par Offre
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={bookingStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="offre_titre" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8">
                        {bookingStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>


     

    
     


    







      

       
           <Card
            variant="solid"
            color="primary"
            invertedColors
            size="lg"
            sx={{
              m: 2,
              borderRadius: 'lg',
              borderRadius: '20px',
              boxShadow: 'lg',
              p: 2,
              maxWidth: '100%',
              boxShadow: 4,
            }}
          >
            <CardContent>
              {/* Top section with icons and stats */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                {/* Total Hotels */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#2e7d32' }}>
                    <HotelIcon />
                  </Avatar>
                  <Box>
                    <Typography level="body-sm">Hôtels Revenu</Typography>
                    <Typography level="h4" fontWeight="lg">
                       {stats.total_paiements_hotel } MAD
                    </Typography>
                  </Box>
                </Stack>

                {/* Total Reservations */}
                <Stack direction="row" spacing={2} alignItems="center" >
                  <Avatar sx={{ bgcolor: '#0288d1' }}>
                    <PeopleAltIcon />
                  </Avatar>
                  <Box>
                    <Typography level="body-sm">Tours Revenu</Typography>
                    <Typography level="h4" fontWeight="lg">
                      {stats.total_paiements_facture} MAD
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Typography level="h6" sx={{ mb: 1 }}>
                  Évolution des Paiements
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={charts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total_facture" stroke="#1976d2" name="Tours" strokeWidth={3} />
                    <Line type="monotone" dataKey="total_hotel" stroke="#2e7d32" name="Hôtels" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>





    </Box>

  </Sidebar>
  );
};

export default ManagerDashboard;
