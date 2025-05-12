import Sidebar from '../components/Sidebar';
import { Box, Typography } from '@mui/joy';
import GroupChat from '../components/GroupChat';

const ComptableDashboard = () => (
  <Box display="flex">
    <Sidebar role="manager" />
    <Box p={4} flexGrow={1}>
      <Typography level="h2">Bienvenue Comptable</Typography>
      <Typography mt={2}>Statistiques et gestion des utilisateurs ici.</Typography>
      <GroupChat/>
    </Box>
  </Box>
);

export default ComptableDashboard;
