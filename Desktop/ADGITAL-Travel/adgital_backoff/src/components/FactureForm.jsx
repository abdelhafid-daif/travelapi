import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Alert,MenuItem  } from '@mui/material';
import { createFacture } from '../api/part';

const FactureForm = ({ facture, onSave }) => {
  const [numeroFacture, setNumeroFacture] = useState(`FCT-${facture.bookingId}`);
  const [prix_offre, setPrix_offre] = useState('');
  const [montant_total, setMontant_total] = useState('');
  const [statut, setStatut] = useState('en attente');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData();
      const bookingId = facture.bookingId;
      const optionIds = facture.options_extras.map(option => option.id);
      formData.append("options_extras", JSON.stringify(optionIds));
      formData.append("numero_facture", numeroFacture);
      formData.append("prix_offre", prix_offre);
      formData.append("montant_total", montant_total);
      formData.append("statut", statut);
      const response = await createFacture(bookingId, formData);

      setSuccess(true);
      onSave(response.data); // Ferme le modal et notifie le parent
    } catch (err) {
      setErreur(err.response?.data?.detail || "Erreur lors de la création de la facture.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Créer une facture pour la réservation #{facture.bookingId}
      </Typography>

      {/* Liste des options sélectionnées */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Options sélectionnées :</Typography>
        {facture.options_extras.length > 0 ? (
          facture.options_extras.map((opt) => (
            <Typography key={opt.id}>
              • {opt.nom} — {opt.prix} MAD
            </Typography>
          ))
        ) : (
          <Typography variant="body2">Aucune option sélectionnée.</Typography>
        )}
      </Box>

      {/* Champs supplémentaires */}
      <TextField
        label="Numéro de facture"
        fullWidth
        margin="normal"
        value={numeroFacture}
        onChange={(e) => setNumeroFacture(e.target.value)}
      />

      <TextField
        label="Prix d'offre -MAD"
        fullWidth
        margin="normal"
        multiline
        value={prix_offre}
        onChange={(e) => setPrix_offre(e.target.value)}
      />
      <TextField
        label="Montant -MAD"
        fullWidth
        margin="normal"
        multiline
        value={montant_total}
        onChange={(e) => setMontant_total(e.target.value)}
      />
      <TextField
        select
        label="Statut"
        fullWidth
        margin="normal"
        value={statut}
        onChange={(e) => setStatut(e.target.value)}
      >
        <MenuItem value="en attente">En attente</MenuItem>
        <MenuItem value="payée">Payée</MenuItem>
        <MenuItem value="annulée">Annulée</MenuItem>
      </TextField>

      {/* Messages */}
      {erreur && <Alert severity="error" sx={{ mt: 2 }}>{erreur}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>Facture créée avec succès.</Alert>}

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer la facture"}
        </Button>
      </Box>
    </form>
  );
};

export default FactureForm;
