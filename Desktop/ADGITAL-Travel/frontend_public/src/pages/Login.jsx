import React from 'react';
import { Card, CardContent, Typography, TextField, Button,Stack  } from '@mui/material';
import { Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import HandshakeIcon from '@mui/icons-material/Handshake';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Footer from '../components/Footer';
export default function Login() {
  return (
    <Box>
     <Navbar />
    <Grid container spacing={2} columns={16} sx={{           alignItems: 'center', 
          justifyContent: 'center', minHeight: '100vh',flexGrow: 1}}>
      {/* Left Section */}
      <Grid 
        item 
        xs={12} md={6} 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color:"#C70039",
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 4
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center' }}
        >


          <Stack spacing={2} md={6} sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TravelExploreIcon sx={{ fontSize: 50, color: '#C70039', mb: 2 }} />
                <Typography variant="body1">
                  As a valued client, enjoy seamless travel bookings, personalized offers, and dedicated support throughout your journey.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Diversity1Icon sx={{ fontSize: 50, color: '#C70039', mb: 2 }} />
                <Typography variant="body1">
                  Our partners - hotels, transport providers, and guides - collaborate with us to offer you exceptional experiences worldwide.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonPinIcon sx={{ fontSize: 50, color: '#C70039', mb: 2 }} />
                <Typography variant="body2">
                  <strong>Your Role:</strong> Manage bookings, track payments, access promotions, and embark on unforgettable adventures.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <HandshakeIcon sx={{ fontSize: 50, color: '#C70039', mb: 2 }} />
                <Typography variant="body2">
                  <strong>Partner Role:</strong> Deliver high-quality services ensuring your journey is smooth, safe, and memorable.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </motion.div>
      </Grid>


      <Grid 
        item 
        xs={12} md={6} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 4
        }}
      >
       <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <Card className="rounded-2xl shadow-lg p-4" sx={{ borderRadius: 5, boxShadow: 6, p: 3, backgroundColor: '#ffffff' }}>
            <CardContent>
            <img src="/logo.svg" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
          <Typography variant="h4" gutterBottom sx={{color:'#070046'}}>
            Welcome to TravelPro AGADIR
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            We are delighted to have you here!
          </Typography>
              <Typography variant="h5" className="mb-6 text-center" sx={{ mb: 3, fontWeight: 'bold', color: '#C70039' }}>
                Login to your account
              </Typography>
              <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: '#C70039' }} />
                  <TextField 
                    label="Email Address" 
                    variant="outlined" 
                    fullWidth 
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon sx={{ color: '#C70039' }} />
                  <TextField 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    fullWidth 
                  />
                </Box>
                <Button variant="contained" size="large" sx={{ mt: 2, borderRadius: 3, backgroundColor: '#C70039', '&:hover': { backgroundColor: '#a5002e' } }}>
                  Login
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    </Grid>
    <Footer/>
    </Box>
  );
}
