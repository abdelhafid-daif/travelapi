import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { fetchCategories, addCategory,deleteCategory,updateCategory } from '../../api/offres'; 
import { Button, TextField, Box, Typography, CircularProgress,Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../../components/Sidebar';
const CategoriePage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState({ id: null, nom: '', ordre: 1 });
  
    // Charger les catégories depuis l'API
    useEffect(() => {
      const fetchCategoriesData = async () => {
        try {
          const data = await fetchCategories();
          setCategories(data);
        } catch (error) {
          setError("Impossible de récupérer les catégories. Vérifiez vos permissions.");
        } finally {
          setLoading(false); 
        }
      };
  
      fetchCategoriesData();
    }, []);
  
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    };
  
    const handleAddCategory = async () => {
      if (newCategory.trim()) {
        const category = { nom: newCategory, slug: generateSlug(newCategory) };
        try {
          const createdCategory = await addCategory(category);
          if (createdCategory) {
            setCategories([...categories, createdCategory]);
            setNewCategory('');
          }
        } catch (error) {
          setError("Erreur lors de l'ajout de la catégorie. Vérifiez vos permissions.");
        }
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (error) {
        setError("Erreur lors de la suppression. Vérifiez vos permissions.");
      }
    };
    
    const openEditDialog = (category) => {
      setEditCategory(category);
      setEditDialogOpen(true);
    };
    
    const handleEdit = async () => {
      const { id, nom, ordre } = editCategory;
      if (!nom.trim()) {
        setError("Le nom de la catégorie ne peut pas être vide");
        return;
      }
      const updatedData = {
        nom: nom,
        slug: generateSlug(nom),  // Utilisation de generateSlug pour garantir un slug correct
        ordre: ordre
      };
  
      try {
        const updated = await updateCategory(id, updatedData);
        setCategories(categories.map(cat => cat.id === id ? updated : cat));
        setEditDialogOpen(false);
      } catch (error) {
        setError("Erreur lors de la mise à jour. Vérifiez vos permissions.");
      }
    };
  
    const columns = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'nom', headerName: 'Nom', width: 200 },
      { field: 'slug', headerName: 'Slug', width: 250 },
      { field: 'ordre', headerName: 'Ordre', width: 100 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        renderCell: (params) => (
          <>
            <Button size="small" onClick={() => openEditDialog(params.row)}>
              <EditIcon fontSize="small" />
            </Button>
            <Button size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </Button>
          </>
        ),
      },
    ];
  
    return (
      <Sidebar>
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Gestion des Catégories
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
  
          <Box display="flex" gap={4} flexWrap="wrap">
            {/* Tableau à gauche */}
            <Box flex={2} minWidth="300px">
              {loading ? (
                <CircularProgress />
              ) : (
                <DataGrid rows={categories} columns={columns} autoHeight pageSize={5} />
              )}
            </Box>
  
            {/* Formulaire à droite */}
            <Card sx={{ flex: 1, minWidth: 300 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Ajouter une catégorie</Typography>
                <TextField
                  label="Nom"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  fullWidth
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAddCategory}
                  startIcon={<AddIcon />}
                >
                  Ajouter
                </Button>
              </CardContent>
            </Card>
          </Box>
  
          {/* MODAL pour édition */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="normal"
                label="Nom"
                value={editCategory.nom}
                onChange={(e) => setEditCategory({ ...editCategory, nom: e.target.value })}
              />
              <TextField
                fullWidth
                margin="normal"
                type="number"
                label="Ordre"
                value={editCategory.ordre}
                onChange={(e) => setEditCategory({ ...editCategory, ordre: parseInt(e.target.value) })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
              <Button variant="contained" onClick={handleEdit}>Enregistrer</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Sidebar>
    );
  };
  
  export default CategoriePage;
  