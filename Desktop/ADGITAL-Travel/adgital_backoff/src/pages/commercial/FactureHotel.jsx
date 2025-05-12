import React, { useState, useEffect,useRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Button } from '@mui/material';
import { fetchReservationDetails } from '../../api/hotels';  // Adjust this path as needed
import html2pdf from 'html2pdf.js';

const Facture = ({ reservationId }) => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchReservationDetails(reservationId);  // Fetch reservation details using the reservationId
        setReservation(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la réservation', error);
      } finally {
        setLoading(false);
      }
    };
    if (reservationId) fetchDetails();
  }, [reservationId]);

  if (loading) {
    return <Typography variant="h6">Chargement de la facture...</Typography>;
  }

  if (!reservation) {
    return <Typography variant="h6" color="error">Aucune réservation trouvée.</Typography>;
  }

  const { client ,client_nom, hotel_nom, chambre, get_nuits, get_total, has_facture ,facture_numero,facture_date_facture} = reservation;
  const montantHT = get_total;
  const tva = montantHT * 0.20; // 20% TVA
  const montantTTC = montantHT + tva;
  const handleExportPDF = () => {
    if (printRef.current) {
      const element = printRef.current;

      const opt = {
        margin:       0.5,
        filename:     `facture-${facture_numero || 'export'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };
  return (
    <Box sx={{ padding: 4 }}>
      <Paper  sx={{ padding: 4 }}>
      <Box ref={printRef} className="print-container">
        <Typography variant="h6" align="center" gutterBottom>
          Facture N° : {facture_numero}
        </Typography>
        

        <Grid  spacing={2} align="right" sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={6}  >
            <Typography variant="body2">Client :</Typography>
            <Typography variant="body2">{client_nom}</Typography>
            <Typography variant="body2">{client.type_client}</Typography>
            <Typography variant="body2">{client.telephone}</Typography>
            <Typography variant="body2">{client.adresse}</Typography>
          </Grid>
        </Grid>

        {/* Reservation Details */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Article</TableCell>
                <TableCell align="right">Prix Unitaire</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Ligne pour la chambre */}
              <TableRow>
                <TableCell component="th" scope="row">
                 <Typography>Hôtel : {hotel_nom}</Typography>
                  Chambre N°: {chambre.type_chambre}  {chambre.numero}
                </TableCell>
                <TableCell align="right">{chambre.prix_par_nuit} MAD/Nuit</TableCell>
                <TableCell align="right">{get_nuits} Nuit(s)</TableCell>
                <TableCell align="right">{get_total} MAD</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" colSpan={2}></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">Montant HT : {montantHT} MAD</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" colSpan={2}></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">TVA (20%) : {tva} MAD</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" colSpan={2}></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">Montant TTC : {montantTTC} MAD</TableCell>
              </TableRow>
              {/* Ligne pour l'inexistence de la facture */}

            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body3" align="center">Date de Facture: {facture_date_facture}</Typography>
        </Box>
        {/* Statut de la Facture */}
        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          {has_facture ? (
            <Button variant="contained" color="primary" onClick={handleExportPDF}>
              Imprimer/PDF
            </Button>
          ) : (
            <Typography variant="h6" color="error">
              Aucune facture disponible pour cette réservation.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Facture;
