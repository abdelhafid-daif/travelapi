import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DataGrid,
  GridActionsCellItem
} from '@mui/x-data-grid';

import { Box, Typography, Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, OutlinedInput, ListItemText,IconButton, } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  getOffres,
  addOffre,
  deleteOffre,
  updateOffre,
  fetchCategories,
  fetchDestination,

} from '../../api/offres';
import Sidebar from "../../components/Sidebar";

const OffrePage = () => {
  const [offres, setOffres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    image_principale: null,
    destinations: [],
    active: true,
    mise_en_avant: false,
    populaire: false,
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchOffres();
    fetchCategoriesData();
    fetchDestinationsData();
  }, []);
  const fetchOffres = async () => {
    try {
      const data = await getOffres();
      setOffres(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchDestinationsData = async () => {
    try {
      const data = await fetchDestination();
      console.log("Destinations récupérées:", data); // Vérification des données reçues
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error.message);
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('categorie', formData.categorie);
    data.append('image_principale', formData.image_principale);
    data.append('active', formData.active);
    data.append('mise_en_avant', formData.mise_en_avant);
    data.append('populaire', formData.populaire);

    if (Array.isArray(formData.destinations)) {
      formData.destinations.forEach((destId) => {
        data.append('destinations', destId);
      });
    }

    try {
      if (editId) {
        const dataUpdate = new FormData();
        dataUpdate.append('titre', formData.titre);
        dataUpdate.append('description', formData.description);
        dataUpdate.append('categorie', formData.categorie);
        dataUpdate.append('active', formData.active);
        dataUpdate.append('mise_en_avant', formData.mise_en_avant);
        dataUpdate.append('populaire', formData.populaire);
      
        if (formData.image_principale) {
          dataUpdate.append('image_principale', formData.image_principale);
        }
      
        if (Array.isArray(formData.destinations)) {
          formData.destinations.forEach((destId) => {
            dataUpdate.append('destinations', destId);
          });
        }
      
        await updateOffre(editId, dataUpdate, true);
      } else {
        await addOffre(data);
      }
      fetchOffres();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    }
  };

  // Gestion de la suppression d'une offre
  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await deleteOffre(id);
        fetchOffres();
      } catch (error) {
        console.error("Erreur de suppression :", error.message);
      }
    }
  };

  // Gestion de l'édition d'une offre
  const handleEdit = (offre) => {
    setEditId(offre.id);
    setFormData({
      titre: offre.titre,
      description: offre.description,
      categorie: offre.categorie.id, // Utiliser l'ID de la catégorie
      destinations: Array.isArray(offre.destinations) ? offre.destinations.map(dest => dest.id) : [], // Assurez-vous que c'est un tableau d'IDs
      image_principale: null,
      active: offre.active,
      mise_en_avant: offre.mise_en_avant,
      populaire: offre.populaire,
    });
  };

  // Gestion du changement de catégorie
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      categorie: value,
    }));
  };

  const handleDestinationsChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      destinations: value, // La nouvelle valeur du select multiple
    });
  };
  

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'titre', headerName: 'Titre', width: 200 },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'categorieNom',  // Utilisation du nouveau champ formaté
      headerName: 'Catégorie',
      width: 120
    },
    {
      field: 'destinationsVilles',  // Utilisation du nouveau champ formaté
      headerName: 'Destinations',
      width: 120
    },
    {
      field: 'image_principale',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Offre"
          style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
        />
      )
    },
    { field: 'active', headerName: 'Active', width: 100, type: 'boolean' },
    { field: 'mise_en_avant', headerName: 'Mis en avant', width: 130, type: 'boolean' },
    { field: 'populaire', headerName: 'Populaire', width: 110, type: 'boolean' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
//     <Sidebar>
//     <Box
//       sx={{
//         maxHeight: '95vh',     
//         overflowY: 'auto',    
//         paddingRight: 2,       
//       }}
//      >
//       <Typography variant="h5" mb={2}>
//         Gestion des Offres
//       </Typography>
//       <Box  gap={2} >
//       <Card sx={{ maxWidth: '500px', margin: '0 auto', padding: 0 }}>
//   <CardContent>
//       <Box component="form" onSubmit={handleSubmit} mb={4} encType="multipart/form-data" sx={{padding: { xs: 2, md: 4 },maxWidth: '800px',margin: '0 auto'}}>
//         <TextField
//           fullWidth
//           label="Titre"
//           value={formData.titre}
//           onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           fullWidth
//           multiline
//           rows={3}
//           label="Description"
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           sx={{ mb: 2 }}
//         />
        
//         {/* Categories dropdown */}
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Catégorie</InputLabel>
//           <Select
//             value={formData.categorie || ''} // Assure-toi qu'il y a toujours une valeur valide
//             onChange={handleCategoryChange}
//             label="Catégorie"
//           >
//             {categories.map((category) => (
//               <MenuItem key={category.id} value={category.id}>
//                 {category.nom}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Destinations checkboxes */}
//         <InputLabel id="destinations-label">Destinations</InputLabel>
//           <Select
//             sx={{ width: '100%' }}
//             labelId="destinations-label"
//             multiple
//             value={formData.destinations}
//             onChange={handleDestinationsChange}
//             input={<OutlinedInput label="Destinations" />}
//             renderValue={(selected) =>
//               selected
//                 .map((id) => {
//                   const found = destinations.find((d) => d.id === id);
//                   return found ? `${found.pays} - ${found.ville}` : id;
//                 })
//                 .join(', ')
//             }
//           >
//             {destinations.map((destination) => (
//               <MenuItem key={destination.id} value={destination.id}>
//                 <Checkbox checked={formData.destinations.includes(destination.id)} />
//                 <ListItemText primary={`${destination.pays} - ${destination.ville}`} />
//               </MenuItem>
//             ))}
//           </Select>

//         <Box sx={{ mt: 2 }}>
//   <Button
//     variant="outlined"
//     component="label"   // Utilisation de label pour simuler un bouton file
//     sx={{ width: '100%' }} // Optionnel: ajuster la taille selon ton besoin
//   >
//     Choisir une image
//     <input
//       type="file"
//       accept="image/*"
//       hidden
//       onChange={(e) => setFormData({ ...formData, image_principale: e.target.files[0] })}
//     />
//   </Button>
// </Box>

//         <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//           <label>
//             <Checkbox
//               checked={formData.active}
//               onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
//             />
//             Actif
//           </label>
//           <label>
//             <Checkbox
//               checked={formData.mise_en_avant}
//               onChange={(e) => setFormData({ ...formData, mise_en_avant: e.target.checked })}
//             />
//             Mis en avant
//           </label>
//           <label>
//             <Checkbox
//               checked={formData.populaire}
//               onChange={(e) => setFormData({ ...formData, populaire: e.target.checked })}
//             />
//             Populaire
//           </label>
//         </Box>

//         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//           {editId ? 'Mettre à jour l\'offre' : 'Ajouter l\'offre'}
//         </Button>
//       </Box>
//       </CardContent>
//       </Card>

//       <DataGrid
//         rows={offres}
//         columns={columns}
//         getRowId={(row) => row.id} // ou row.pk, row._id, etc.
//         pageSize={5}
//         rowsPerPageOptions={[5, 10]}
//       />
//     </Box>
// </Box>
//     </Sidebar>

<Sidebar>
  <Box sx={{ maxHeight: '95vh', overflowY: 'auto', padding: 4 }}>
    <Typography variant="h5" mb={2} sx={{ fontWeight: 'bold' }}>
      Gestion des Offres
    </Typography>
    <Box display="flex" gap={4} flexWrap="wrap">
      

    {/* DataGrid */}
    <Box flex={2} minWidth="320px">
      <DataGrid
        rows={offres}
        columns={columns}
        getRowId={(row) => row.id} // ou row.pk, row._id, etc.
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
    </Box>

    <Card sx={{ flex: 1, minWidth: 280 }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            mb={4}
            encType="multipart/form-data"
            sx={{
              padding: { xs: 2, md: 4 },
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <TextField
              fullWidth
              label="Titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />

            {/* Categories dropdown */}
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={formData.categorie || ''}
                onChange={handleCategoryChange}
                label="Catégorie"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Destinations checkboxes */}
            <InputLabel id="destinations-label">Destinations</InputLabel>
            <Select
              sx={{ width: '100%' }}
              labelId="destinations-label"
              multiple
              value={formData.destinations}
              onChange={handleDestinationsChange}
              input={<OutlinedInput label="Destinations" />}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const found = destinations.find((d) => d.id === id);
                    return found ? `${found.pays} - ${found.ville}` : id;
                  })
                  .join(', ')
              }
            >
              {destinations.map((destination) => (
                <MenuItem key={destination.id} value={destination.id}>
                  <Checkbox checked={formData.destinations.includes(destination.id)} />
                  <ListItemText primary={`${destination.pays} - ${destination.ville}`} />
                </MenuItem>
              ))}
            </Select>

            {/* Image upload button */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ width: '100%' }}
              >
                Choisir une image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setFormData({ ...formData, image_principale: e.target.files[0] })}
                />
              </Button>
            </Box>

            {/* Checkboxes for options */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <label>
                <Checkbox
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                Actif
              </label>
              <label>
                <Checkbox
                  checked={formData.mise_en_avant}
                  onChange={(e) => setFormData({ ...formData, mise_en_avant: e.target.checked })}
                />
                Mis en avant
              </label>
              <label>
                <Checkbox
                  checked={formData.populaire}
                  onChange={(e) => setFormData({ ...formData, populaire: e.target.checked })}
                />
                Populaire
              </label>
            </Box>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              {editId ? 'Mettre à jour l\'offre' : 'Ajouter l\'offre'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>

  </Box>
</Sidebar>

    
  );
};

export default OffrePage;
