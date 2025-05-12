import React from 'react';
import Sidebar from '../components/Sidebar';
import { Box, Button, Typography } from '@mui/joy';

const Not = ({ user }) => {
  return (
    <Sidebar>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', padding: '16px', minHeight: '100vh', overflowX: 'hidden' }}>
        <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <Typography level="h4" sx={{ color: '#333', marginBottom: '16px' }}>
            Welcome to Your Dashboard
          </Typography>
          <Typography level="body1" sx={{ color: '#555', marginBottom: '16px' }}>
            Manage your account, view your statistics, and access your resources.
          </Typography>
          <Button variant="solid" color="primary" sx={{ marginBottom: '16px' }}>
            Action Button
          </Button>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default Not;
