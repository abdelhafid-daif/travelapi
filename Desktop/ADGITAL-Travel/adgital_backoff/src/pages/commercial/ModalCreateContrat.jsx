import { Modal, Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { createContrats } from '../../api/part';

const ModalCreateContrat = ({ open, onClose, partenaireId }) => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [fichier, setFichier] = useState(null); // Nouveau !

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('partenaire', partenaireId);
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('date_debut', new Date().toISOString().split('T')[0]);
        formData.append('date_fin', new Date().toISOString().split('T')[0]);
        formData.append('statut', 'actif');
        if (fichier) {
          formData.append('fichier_contrat', fichier);
        }
    
        await createContrats(formData);
        onClose();
      };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, backgroundColor: 'white', width: 400, margin: '100px auto', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            onChange={(e) => setFichier(e.target.files[0])}
            style={{ marginTop: 16 }}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Créer Contrat
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCreateContrat;
