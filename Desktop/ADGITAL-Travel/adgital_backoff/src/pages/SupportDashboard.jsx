import Sidebar from '../components/Sidebar';
import { Box, Typography } from '@mui/joy';
import GroupChat from '../components/GroupChat';

const SupportDashboard = () => (
  <Box display="flex">
    <Sidebar role="support" />
    <Box p={4} flexGrow={1}>
      <Typography level="h2">Bienvenue Support</Typography>
      <Typography mt={2}>Suivez et répondez aux tickets ici.</Typography>
      <GroupChat/>
    </Box>
  </Box>
);

export default SupportDashboard;
