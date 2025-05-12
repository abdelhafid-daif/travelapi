import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const DashboardSummaryCard = ({ stats, charts }) => {
  return (
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
            <Avatar sx={{ bgcolor: '#2e7d32' }}>
              <HotelIcon />
            </Avatar>
            <Box>
              <Typography level="body-sm">Total Hôtels</Typography>
              <Typography level="h4" fontWeight="lg">
                {stats.total_paiements_hotel}
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
                {stats.total_paiements_facture}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Chart section */}
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
  );
};

export default DashboardSummaryCard;
