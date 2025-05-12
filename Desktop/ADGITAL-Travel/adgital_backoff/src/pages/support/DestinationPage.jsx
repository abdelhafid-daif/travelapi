import React, { useEffect, useState } from 'react';
import {
  fetchDestination,
  addDestination,
  updateDestination,
  deleteDestination
} from '../../api/offres';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../../components/Sidebar';
import {  Stack, Avatar } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import CloseIcon from '@mui/icons-material/Close';
const DestinationPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [newData, setNewData] = useState({ ville: '', pays: '', image: '', populaire: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, ville: '', pays: '', populaire: false });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDestination();
        setDestinations(data);
      } catch (err) {
        setError("Erreur lors du chargement des destinations.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = async () => {
    try {
      const formData = {
        ville: newData.ville,
        pays: newData.pays,
        image: newData.image,
        populaire: newData.populaire,
      };
      const created = await addDestination(formData);
      setDestinations([...destinations, created]);
      setNewData({ ville: '', pays: '', image: '', populaire: false });
    } catch (err) {
      setError("Erreur lors de l'ajout.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDestination(id);
      setDestinations(destinations.filter(dest => dest.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('ville', editData.ville);
      formData.append('pays', editData.pays);
      formData.append('populaire', editData.populaire);
      if (editData.image) {
        formData.append('image', editData.image);
      }
  
      const updated = await updateDestination(editData.id, formData, true);
      setDestinations(destinations.map(dest => dest.id === updated.id ? updated : dest));
      setEditDialogOpen(false);
    } catch (err) {
      setError("Erreur lors de la mise à jour.");
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'ville', headerName: 'Ville', width: 150 },
    { field: 'pays', headerName: 'Pays', width: 150 },
    {
        field: 'image',
        headerName: 'Image',
        width: 100,
        renderCell: (params) =>
          params.value ? (
            <img src={params.value} alt="destination" width="80" />
          ) : (
            'Pas d’image'
          )
      },
    {
      field: 'populaire',
      headerName: 'Populaire',
      width: 120,
      renderCell: (params) => params.value ? <DoneSharpIcon color='success'/> : <CloseIcon  color="error"/> 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => { setEditData(params.row); setEditDialogOpen(true); }}>
            <EditIcon fontSize="small" />
          </Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </Button>
        </>
      )
    }
  ];

  return (
    <Sidebar>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Gestion des Destinations</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" gap={4} flexWrap="wrap">
          <Box flex={2}>
            {loading ? <CircularProgress /> : (
              <DataGrid rows={destinations} columns={columns} sx={{maxWidth:800}} autoHeight pageSize={5} />
            )}
          </Box>

          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6">Ajouter une Destination</Typography>
              <TextField
                label="Ville"
                fullWidth
                value={newData.ville}
                onChange={(e) => setNewData({ ...newData, ville: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Pays"
                fullWidth
                value={newData.pays}
                onChange={(e) => setNewData({ ...newData, pays: e.target.value })}
                margin="normal"
              />
                <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    setNewData({ ...newData, image: e.target.files[0] })
                }
                />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newData.populaire}
                    onChange={(e) => setNewData({ ...newData, populaire: e.target.checked })}
                  />
                }
                label="Populaire"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={handleAdd}
              >
                Ajouter
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Modifier la Destination</DialogTitle>
          <DialogContent>
            <TextField
              label="Ville"
              fullWidth
              margin="normal"
              value={editData.ville}
              onChange={(e) => setEditData({ ...editData, ville: e.target.value })}
            />
            <TextField
              label="Pays"
              fullWidth
              margin="normal"
              value={editData.pays}
              onChange={(e) => setEditData({ ...editData, pays: e.target.value })}
            />
            <Stack direction="row" spacing={2} alignItems="center" marginTop={2}>
            <Avatar
                src={
                    editData.image
                    ? typeof editData.image === 'string'
                        ? editData.image
                        : URL.createObjectURL(editData.image)
                    : ''
                }
                sx={{ width: 64, height: 64 }}
            />
            <label htmlFor="image-upload">
                <input
                accept="image/*"
                id="image-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) =>
                    setEditData({ ...editData, image: e.target.files[0] })
                }
                />
                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                Changer l'image
                </Button>
            </label>
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  checked={editData.populaire}
                  onChange={(e) => setEditData({ ...editData, populaire: e.target.checked })}
                />
              }
              label="Populaire"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleUpdate}>Enregistrer</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Sidebar>
  );
};

export default DestinationPage;
