import Sidebar from '../components/Sidebar';
import { Box, Typography } from '@mui/joy';
import GroupChat from '../components/GroupChat';

const CommercialDashboard = () => (
  <Box display="flex">
    <Sidebar role="commercial" />
    <Box p={4} flexGrow={1}>
      <Typography level="h2">Bienvenue Commercial</Typography>
      <Typography mt={2}>Gérez vos clients et offres ici.</Typography>
      <GroupChat/>
    </Box>
  </Box>
);

export default CommercialDashboard;
