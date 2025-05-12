import React from "react";
import { Container, Typography, Grid, Box, Avatar } from "@mui/material";
import {  List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const AboutSection = () => {
  return (
    <Box sx={{ backgroundColor: "#FFDEDE", py: 6  }}>
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom sx={{color:'#CF0F47'}}>
           Plateforme de démonstration
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{color:'#FF0B55'}}>
          Ce site a été conçu uniquement à des fins de test et d’illustration.
        </Typography>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid size={{ xs: 6, md: 8 }}>
            <Typography variant="body2" sx={{ color:'#000000' ,display: "flex", alignItems: "center", height: "100%" }}>
            Ce site a été conçu dans le cadre d’un projet de démonstration et ne représente pas une véritable agence de voyage en activité.
             Son objectif est de présenter une maquette fonctionnelle d’une plateforme de réservation de voyages.

            Toutes les informations affichées sur ce site, y compris les destinations, les prix,
            les avis clients et les options de réservation, sont fictives ou utilisées à des fins de test uniquement.

            Aucune des offres présentées ne peut être réservée ou achetée, et aucune donnée utilisateur n’est collectée à des fins commerciales.
            </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
                <Avatar
                alt="Team"
                src=""
                variant="circular"
                sx={{ width: 220, height: 220, mx: "auto" }}
                />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
                <Avatar
                alt="Customer Service"
                src=""
                variant="circular"
                sx={{ width: 220, height: 220, mx: "auto" }}
                />
            </Grid>
            <Grid size={{ xs: 6, md: 8 }}>
            <Typography variant="h3" sx={{color:'#000000', mb: 1 }}>
  À quoi sert cette démonstration ?
</Typography>

<List sx={{ color:'#000000', pl: 2 }}>
  <ListItem sx={{ display: "list-item", padding: 0 }}>
  <ListItemIcon>
    <CheckCircleIcon sx={{ color:'#000000' }} />
  </ListItemIcon>
    <ListItemText primary="Montrer l’interface d’une agence de voyage moderne." />
  </ListItem>
  <ListItem sx={{ display: "list-item", padding: 0 }}>

    <ListItemText primary="Illustrer des fonctionnalités comme la recherche, la réservation ou la gestion de voyages." />
  </ListItem>
  <ListItem sx={{ display: "list-item", padding: 0 }}>

    <ListItemText primary="Tester l’expérience utilisateur sur différents supports (mobile, tablette, ordinateur)." />
  </ListItem>
  <ListItem sx={{ display: "list-item", padding: 0 }}>

    <ListItemText primary="Servir de support à un projet personnel, professionnel ou académique." />
  </ListItem>
  <ListItem sx={{ display: "list-item", padding: 0 }}>

    <ListItemText primary="Merci de ne pas entrer d’informations personnelles sensibles dans les formulaires." />
  </ListItem>
</List>
            </Grid>
        </Grid>


      </Container>
    </Box>
  );
};

export default AboutSection;
