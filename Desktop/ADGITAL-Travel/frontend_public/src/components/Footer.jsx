import React from 'react';
import { Box, Typography, IconButton, Grid, Link, Divider } from '@mui/material';
import {
  Email as EmailIcon, Instagram, Facebook, Twitter, LinkedIn, WhatsApp,
  TravelExplore, DirectionsCar, LocalShipping
} from '@mui/icons-material';

const galleryImages = [
  '/travel.jpg',
  '/travel.jpg',
  '/travel.jpg',
  '/travel.jpg'
];

const Footer = () => {
  return (
    <Box sx={{ background: '#f2f2f7', color: '#070046', mt: 6, pt: 6, pb: 4, px: 2, borderTop: '8px solid #C70039' }}>
      <Grid container spacing={4} justifyContent="center">

        {/* Contact */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>Contactez-nous</Typography>
          <Typography><EmailIcon fontSize="small" /> contact@adgital.ma</Typography>
          <Typography><WhatsApp fontSize="small" sx={{ color: '#25D366' }} /> +2126 4334 9787</Typography>
          <Box sx={{ mt: 1 }}>
            <IconButton href="https://instagram.com" target="_blank"><Instagram /></IconButton>
            <IconButton href="https://facebook.com" target="_blank"><Facebook /></IconButton>
            <IconButton href="https://twitter.com" target="_blank"><Twitter /></IconButton>
            <IconButton href="https://linkedin.com" target="_blank"><LinkedIn /></IconButton>
          </Box>
        </Grid>

        {/* Tour Types */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" gutterBottom>Types de Tours</Typography>
          <Typography><TravelExplore fontSize="small" /> Aventure</Typography>
          <Typography><DirectionsCar fontSize="small" /> Circuit voiture</Typography>
          <Typography><LocalShipping fontSize="small" /> Excursions privées</Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" gutterBottom>Liens rapides</Typography>
          <Link href="/" underline="hover" color="inherit">Accueil</Link><br />
          <Link href="/about" underline="hover" color="inherit">À propos</Link><br />
          <Link href="/contact" underline="hover" color="inherit">Contact</Link>
        </Grid>

        {/* Légaux */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" gutterBottom>Légal</Typography>
          <Link href="/terms" underline="hover" color="inherit">Conditions générales</Link><br />
          <Link href="/privacy" underline="hover" color="inherit">Politique de confidentialité</Link><br />
          <Link href="/programmer" underline="hover" color="inherit">Programme</Link>
        </Grid>

        {/* Galerie */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>Galerie</Typography>
          <Grid container spacing={1}>
            {galleryImages.map((src, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  component="img"
                  src={src}
                  alt={`gallery-${index}`}
                  sx={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2}} />

      <Typography align="center" sx={{ fontSize: 14 }}>
        &copy; {new Date().getFullYear()} TravelDemo. Tous droits réservés.
      </Typography>

      <Typography align="center" sx={{ fontSize: 13, mt: 1 }}>
        Développé par <strong>© ADGITAL</strong>  Agence Web & Logiciels. Solutions digitales sur mesure, sécurisées et innovantes.
      </Typography>
    </Box>
  );
};

export default Footer;
