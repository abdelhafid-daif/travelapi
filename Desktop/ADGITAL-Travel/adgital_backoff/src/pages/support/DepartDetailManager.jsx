import React, { useEffect, useState } from 'react';
import { getDeparts, createDepart, updateDepart, deleteDepart, getOffres } from '../../api/offres';
import { DataGrid } from '@mui/x-data-grid';
import Sidebar from '../../components/Sidebar';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DepartDetailManager = () => {
  const [departs, setDeparts] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    date_depart: '',
    date_retour: '',
    prix: '',
    places_total: '',
    places_dispo: '',
    statut: 'ouvert',
    offre: null,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch Depart details
  const fetchDeparts = async () => {
    try {
        const response = await getDeparts();
        setDeparts(response.data);
      } catch (error) {
        setError("Impossible de récupérer les départs. Vérifiez vos permissions.");
      } finally {
        setLoading(false); 
      }
  };

  // Fetch Offers
  const fetchOffres = async () => {
    try {
      const response = await getOffres();
      setOffres(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erreur chargement offres", error);
      setOffres([]);
    }
  };

  useEffect(() => {
    fetchDeparts();
    fetchOffres();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDepart(editingId, {
        ...form,
        offre: form.offre?.id,
      });
    } else {
      await createDepart({
        ...form,
        offre: form.offre?.id,
      });
    }
    resetForm();
    fetchDeparts();
  };

  // Reset form
  const resetForm = () => {
    setForm({
      date_depart: '',
      date_retour: '',
      prix: '',
      places_total: '',
      places_dispo: '',
      statut: 'ouvert',
      offre: null,
    });
    setEditingId(null);
  };

  // Handle edit button click
  const handleEdit = (params) => {
    const selected = params.row;
    const selectedOffre = Array.isArray(offres) ? offres.find(o => o.id === selected.offre?.id) : null;
    setForm({
      ...selected,
      offre: selectedOffre || null,
    });
    setEditingId(params.id);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce départ ?')) {
      await deleteDepart(id);
      fetchDeparts();
    }
  };

  // DataGrid columns definition
  const columns = [
    { field: 'offre_titre', headerName: 'Offre', width: 180, editable: false },
    { field: 'date_depart', headerName: 'Départ', width: 110, editable: true },
    { field: 'date_retour', headerName: 'Retour', width: 110, editable: true },
    { field: 'prix', headerName: 'Prix', width: 100, editable: true },
    { field: 'places_total', headerName: 'Total', width: 90, editable: true },
    { field: 'places_dispo', headerName: 'Dispo', width: 90, editable: true },
    { field: 'statut', headerName: 'Statut', width: 90, editable: true },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Handle row edit
  const handleRowEdit = async (newRow) => {
    // Update the row data
    await updateDepart(newRow.id, {
      ...newRow,
      offre: newRow.offre?.id,
    });
    fetchDeparts();
    return newRow;
  };

  return (
    <Sidebar>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" gutterBottom>Liste des Départs</Typography>

        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" gap={4} flexWrap="wrap">
          <Box flex={2} minWidth="300px">
            {loading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={departs}
                columns={columns}
                getRowId={(row) => row.id}
                pageSize={5}
                rowsPerPageOptions={[5]}
                processRowUpdate={handleRowEdit}  // Handle row editing in DataGrid
              />
            )}
          </Box>

          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editingId ? 'Modifier le départ' : 'Ajouter un départ'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Autocomplete
                  options={offres}
                  getOptionLabel={(option) => option.titre}
                  onChange={(e, value) => {
                    setForm({
                      ...form,
                      offre: value,
                      prix: value?.prix || '',
                      places_total: value?.places_total || '',
                      places_dispo: value?.places_total || '',
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Offre"
                      margin="dense"
                    />
                  )}
                  value={form.offre || null}
                  disabled={offres.length === 0}
                  loading={offres.length === 0}
                />
                <TextField
                  fullWidth
                  label="Date de départ"
                  type="date"
                  name="date_depart"
                  value={form.date_depart}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Date de retour"
                  type="date"
                  name="date_retour"
                  value={form.date_retour}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Prix"
                  name="prix"
                  type="number"
                  value={form.prix}
                  onChange={handleChange}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Places totales"
                  name="places_total"
                  type="number"
                  value={form.places_total}
                  onChange={handleChange}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Places disponibles"
                  name="places_dispo"
                  type="number"
                  value={form.places_dispo}
                  onChange={handleChange}
                  margin="dense"
                />
                <Select
                  fullWidth
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  margin="dense"
                  displayEmpty
                >
                  <MenuItem value="ouvert">Ouvert</MenuItem>
                  <MenuItem value="ferme">Fermé</MenuItem>
                  <MenuItem value="complet">Complet</MenuItem>
                </Select>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default DepartDetailManager;
