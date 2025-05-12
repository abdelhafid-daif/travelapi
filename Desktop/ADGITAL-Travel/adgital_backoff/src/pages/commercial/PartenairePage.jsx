import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getPartenaire, createPartenaire ,getPartContrats,getSecureFileContratUrl} from '../../api/part'; 
import { getUser } from '../../api/users';
import {  Grid,Button, TextField, Box, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem ,Modal,Stack} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PublicIcon from '@mui/icons-material/Public';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import Sidebar from '../../components/Sidebar';
import ModalCreateContrat from './ModalCreateContrat';
import DownloadIcon from '@mui/icons-material/Download';


const TYPE_CHOICES = [
    { value: 'hotel', label: 'Hôtel' },
    { value: 'transport', label: 'Transport' },
    { value: 'guide', label: 'Guide touristique' },
    { value: 'agence_locale', label: 'Agence locale' },
    { value: 'autre', label: 'Autre' },
];
const typeIcons = {
  hotel: <HotelIcon style={{ fontSize: 20, color: '#fff' }} />,
  transport: <DirectionsCarIcon style={{ fontSize: 20, color: '#fff' }} />,
  guide: <EmojiPeopleIcon style={{ fontSize: 20, color: '#fff' }} />,
  agence_locale: <PublicIcon style={{ fontSize: 20, color: '#fff' }} />,
  autre: <CategoryIcon style={{ fontSize: 20, color: '#fff' }} />,
};
const typeColor = {
  hotel: '#d84315',
  transport: '#c62828',
  guide: '#673ab7',
  agence_locale: '#ffc107',
  autre: '#364152',
};
const ContratActions = ({ partenaireId }) => {
  const [contrats, setContrats] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState(null); // Nouvelle variable d'état pour le contrat sélectionné
  const [opencreate, setOpenCreateModal] = useState(false);


  useEffect(() => {
    async function fetchContrats() {
      try {
        const response = await getPartContrats(partenaireId);
        setContrats(response.data);
      } catch (error) {
        console.error('Erreur en récupérant les contrats:', error);
      }
    }
    fetchContrats();
  }, [partenaireId]);

  // Fonction pour télécharger le fichier du contrat
  // const downloadFichier = (contrat) => {
  //   const fileUrl = contrat.fichier_contrat; // L'URL du fichier du contrat
  //   const link = document.createElement('a');
  //   link.href = fileUrl;
  //   link.download = 'contrat_' + contrat.id; // Personnalisation du nom du fichier
  //   link.click();
  // };
  const downloadFichier = async (contrat) => {
    
      const fileUrl = getSecureFileContratUrl(contrat.fichier_contrat); // getSecureFileContratUrl doit retourner une URL complète
      const fileName = contrat.fichier_contrat.split('/').pop();
      fetch(fileUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,  
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Le téléchargement a échoué');
          }
          return response.blob();
        })
        .then(blob => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = fileName; 
          link.click();
        })
        .catch(error => console.error('Erreur de téléchargement du fichier:', error));
  };

  const handleOpen = (contrat) => {
    setSelectedContrat(contrat); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContrat(null); 
  };
  const handleOpenCreate = () => {
    setOpenCreateModal(true);
  };
  
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  return (
    <div>
      {contrats.length > 0 ? (
        contrats.map((contrat) => (
          <Tooltip title="Voir Contrat" key={contrat.id}>
            <IconButton color="primary" onClick={() => handleOpen(contrat)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        ))
      ) : (
        <>
          <Tooltip title="Ajouter Contrat">
            <IconButton color="success" onClick={handleOpenCreate}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <ModalCreateContrat open={opencreate} onClose={handleCloseCreate} partenaireId={partenaireId} />
        </>
      )}

      {selectedContrat && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Détail du Contrat
            </Typography>
            <Typography><strong>ID:</strong> {selectedContrat.id}</Typography>
            <Typography><strong>Partenaire:</strong> {selectedContrat.partenaire}</Typography>
            <Typography><strong>Titre:</strong> {selectedContrat.titre}</Typography>
            <Typography><strong>Description:</strong> {selectedContrat.description}</Typography>
            <Typography><strong>Date début:</strong> {selectedContrat.date_debut}</Typography>
            <Typography><strong>Date fin:</strong> {selectedContrat.date_fin}</Typography>
            <Typography><strong>Statut:</strong> {selectedContrat.statut}</Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={() => downloadFichier(selectedContrat)}
              sx={{ mt: 2 }}
            >
              Télécharger le Contrat
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};


const PartenairePage = () => {
    const [partenaires, setPartenaires] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [commercialResponsable, setCommercialResponsable] = useState(null);  
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [newPartenaire, setNewPartenaire] = useState({
        nom: '',
        type_partenaire: '',
        contact_nom: '',
        contact_email: '',
        contact_telephone: '',
        site_web: '',
        actif: true,
        remarque: '',
        offres_associees: '',
    });



    const fetchPartenaireData = async () => {
        try {
            const response = await getPartenaire();
            setPartenaires(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError("Impossible de récupérer les partenaires. Vérifiez vos permissions.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPartenaireData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                setCommercialResponsable(userData.id);  
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        setNewPartenaire({ ...newPartenaire, [e.target.name]: e.target.value });
    };
    
    const handleSelectChange = (e) => {
        setNewPartenaire({ ...newPartenaire, type_partenaire: e.target.value });
    };
    
    const handleSubmit = async () => {
        try {
            await createPartenaire({
                ...newPartenaire,
                commercial_responsable: commercialResponsable,
            });
            setOpenModal(false);
            setLoading(true);
            await fetchPartenaireData();
        } catch (error) {
            setError('Erreur lors de la création du partenaire');
            setLoading(false); 
        } finally {
            setLoading(false);
        }
    };
    const countByType = (type) => {
      return partenaires.filter((p) => p.type_partenaire === type).length;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'nom', headerName: 'Nom', width: 150 },
        { field: 'type_partenaire', headerName: 'Type Partenaire', width: 100 },
        { field: 'contact_nom', headerName: 'Contact Nom', width: 100 },
        { field: 'contact_email', headerName: 'Contact Email', width: 100 },
        { field: 'contact_telephone', headerName: 'Contact Téléphone', width: 100 },
        { field: 'site_web', headerName: 'Site Web', width: 100 },
        { field: 'actif', headerName: 'Actif', width: 100 },
        { field: 'remarque', headerName: 'Remarque', width: 100 },
        { field: 'offres_associees', headerName: 'Offres Associées', width: 100 },
        { field: 'commercial_responsable', headerName: 'Commercial Responsable', width: 100 },
        {
          field: 'actions',
          headerName: 'Contrat',
          width: 120,
          renderCell: (params) => <ContratActions partenaireId={params.row.id} />
        },
    ];

    return (
        <Sidebar>
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gestion des Partenaires
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                                {/* Statistiques */}
                                <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
                          <Grid item xs={12} sm={6} md={3}>
                          <Card  sx={{ backgroundColor: '#1e88e5', color: '#fff', borderRadius: 10 ,minWidth:'150px'}}>
                              <CardContent>
                              <Stack direction="row" alignItems="center" spacing={1}>
                              <GroupIcon style={{ fontSize: 20, color: '#fff', marginRight: 10 }} />
                                <Typography variant="subtitle1">Total Partenaires </Typography>
                              </Stack>

                              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                                <Typography variant="h5" fontWeight="bold">
                                {partenaires.length}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                          </Grid>

                    {TYPE_CHOICES.map((choice) => (

                          <Grid item xs={12} sm={6} md={3}>
                          <Card key={choice.value} sx={{ backgroundColor: typeColor[choice.value], color: '#fff', borderRadius: 10,minWidth:'150px' }}>
                              <CardContent>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                {typeIcons[choice.value]}
                                <Typography variant="subtitle1">{choice.label} </Typography>
                              </Stack>

                              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                                <Typography variant="h5" fontWeight="bold">
                                {countByType(choice.value)}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                          </Grid>
                    ))}
                </Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenModal(true)}
                >
                    Ajouter un Partenaire
                </Button>
                <Box display="flex" gap={4} flexWrap="wrap">
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <DataGrid rows={partenaires} columns={columns} autoHeight pageSize={5} />
                    )}
                </Box>
                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <DialogTitle>Ajouter un nouveau partenaire</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Nom"
                            name="nom"
                            value={newPartenaire.nom}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Select
                            label="Type Partenaire"
                            name="type_partenaire"
                            value={newPartenaire.type_partenaire}
                            onChange={handleSelectChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
                            {TYPE_CHOICES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Contact Nom"
                            name="contact_nom"
                            value={newPartenaire.contact_nom}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Contact Email"
                            name="contact_email"
                            value={newPartenaire.contact_email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Contact Téléphone"
                            name="contact_telephone"
                            value={newPartenaire.contact_telephone}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Site Web"
                            name="site_web"
                            value={newPartenaire.site_web}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Remarque"
                            name="remarque"
                            value={newPartenaire.remarque}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Offres Associées"
                            name="offres_associees"
                            value={newPartenaire.offres_associees}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)} color="secondary">
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            Ajouter
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Sidebar>
    );
};

export default PartenairePage;
