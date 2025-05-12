import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid ,Stack,Avatar  } from '@mui/joy';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {fetchPaiementsStats} from '../../api/part';
import Sidebar from '../../components/Sidebar';
import PaymentIcon from '@mui/icons-material/Payment';
import StyleIcon from '@mui/icons-material/Style';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const FacturesStats = () => {
  const [stats, setStats] = useState(null);
  const [charts,setCharts] = useState(null);

  useEffect(() => {
    // Appel à l'API via la fonction importée depuis api.js
    fetchPaiementsStats()
      .then((data) => {
        setStats(data);
        setCharts(data.paiements_par_date); // ✅ Utilise les données de la clé appropriée
      })
      .catch((error) => console.error('Erreur lors de la récupération des statistiques:', error));
  }, []);

  if (!stats) {
    return <Typography>Chargement des statistiques...</Typography>;
  }


  return (
    <Sidebar>

    <Box sx={{ flexGrow: 1 }}>
      <Typography level="h4" sx={{ marginBottom: 2 }}>Statistiques des Paiements</Typography>



  <Card
      variant="solid"
      color="primary"
      invertedColors
      size="lg"
      sx={{
        m: 2,
        borderRadius: 'lg',
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
            <Avatar sx={{ bgcolor: '#f44336' }}>
              <HotelIcon />
            </Avatar>
            <Box>
              <Typography level="body-sm">Total Hôtels</Typography>
              <Typography level="h4" fontWeight="lg">
                {stats.total_paiements_hotel}-MAD
              </Typography>
            </Box>
          </Stack>

          {/* Total Reservations */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#0288d1' }}>
              <PeopleAltIcon />
            </Avatar>
            <Box>
              <Typography level="body-sm">Total Réservations</Typography>
              <Typography level="h4" fontWeight="lg">
                {stats.total_paiements_facture}-MAD
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Chart section */}

      </CardContent>
    </Card>

        
      <Box sx={{ p: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>Évolution des Paiements</Typography>

      <Card variant="outlined">
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={charts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_facture" stroke="#1976d2" name="Tours" strokeWidth={3} />
              <Line type="monotone" dataKey="total_hotel" stroke="#f44336" name="Hôtels" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
    </Box>
    </Sidebar>

  );
};

export default FacturesStats;
