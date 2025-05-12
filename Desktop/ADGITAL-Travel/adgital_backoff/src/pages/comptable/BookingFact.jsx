import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {Card , Button, Checkbox, Typography , CircularProgress, Alert ,Box , IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,Modal,Tooltip,Divider,Chip ,Select,Dialog, DialogTitle, DialogContent, DialogActions,TextField } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description'; 
import ArchiveIcon from '@mui/icons-material/Archive';
import { getBookingFactures , updateFactureStatut,createArchiveFacture, createArchiveFactureHotel } from '../../api/part';
import { fetchReservations } from '../../api/hotels';
import Sidebar from '../../components/Sidebar';
import html2pdf from 'html2pdf.js';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
const TVA_RATE = 0.20;
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const statutOptions = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'annulee', label: 'Annulée' },
];
const BookingFact = (props) => {
  const [reservations , setReservations]= useState([]);
  const [stats, setStats] = useState({ total: 0, parStatut: {} });
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const printRef = useRef();
  const [value, setValue] = useState("");
  const [rows, setRows] = React.useState([]);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [openArchiveModal2, setOpenArchiveModal2] = useState(false);
  const [paiementData, setPaiementData] = useState({
    methode: '',
    montant: '',
    note: '',
    fichier_facture: null,
  });
  const handleFileChange = (e) => {
    setPaiementData((prev) => ({ ...prev, fichier_facture: e.target.files[0] }));
  };

  const handleExportPDF = () => {
    if (printRef.current) {
      const element = printRef.current;

      const opt = {
        margin:       0.5,
        filename:     `facture-${selectedFacture?.numero_facture || 'export'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };
  const handleExportPDF2 = () => {
    if (printRef.current) {
      const element = printRef.current;

      const opt = {
        margin:       0.5,
        filename:     `facture-${selectedReservation?.facture_numero || 'export'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getBookingFactures();
        console.log('data:',response.data);
        setFactures(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Erreur lors du chargement des données de réservation.");
      } finally {
        setLoading(false);
      }
    };
    const fetchReservationsData = async () => {
      try {
        const response = await fetchReservations();
        console.log('reservations data', response.data);
        if (Array.isArray(response.data)) {
          const transformedReservations = response.data.map(reservation => ({
            ...reservation,
            client_type: reservation.client?.type_client || '—',
            client_telephone: reservation.client?.telephone || '—',
            hotel_nom: reservation.chambre?.hotel_nom || '—',
            hotel_adresse: reservation.chambre?.hotel_adresse || '—',
            numero_chambre: reservation.chambre?.numero || '—',
            type_chambre: reservation.chambre?.type_chambre || '—',
            prix_par_nuit: reservation.chambre?.prix_par_nuit || '—',
          }));
          setReservations(transformedReservations);
          const total = transformedReservations.length;

          const parStatut = transformedReservations.reduce((acc, res) => {
            const statut = res.statut || 'Inconnu';
            acc[statut] = (acc[statut] || 0) + 1;
            return acc;
          }, {});
        
          setStats({ total, parStatut });
        } else {
          setReservations([]);
          setError("Les données de réservation ne sont pas dans le format attendu.");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Impossible de récupérer les données de réservation. Vérifiez vos permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsData();
    load();
  }, []);

  const handleGenerateFacture = (facture) => {
    setSelectedFacture(facture);
  };
  const handleGenerateFacture2 = (facture) => {
    setSelectedReservation(facture);
  };

  const handleCloseModal = () => {
    setSelectedFacture(null);
  };
  const handleCloseModal2 = () => {
    setSelectedReservation(null);
  };
  const handlePaiementSubmit = async () => {
    try {

      if (!paiementData || !selectedFacture) {
        alert('Données manquantes.');
        return;
      }
      const formData = new FormData();
      formData.append('facture', selectedFacture.id);
      formData.append('methode', paiementData.methode);
      formData.append('montant', paiementData.montant);
      formData.append('note', paiementData.note);
      if (paiementData.fichier_facture) {
        formData.append('fichier_facture', paiementData.fichier_facture);
      }
      await createArchiveFacture(formData);
      alert('Facture archivée avec succès');
      setOpenArchiveModal(false);
    } catch (error) {
      console.error('Erreur archivage:', error);
      alert('Erreur lors de l’archivage');
    }
  };
  const handlePaiementSubmit2 = async () => {
    try {

      if (!paiementData || !selectedReservation) {
        alert('Données manquantes.');
        return;
      }
      const formData = new FormData();
      formData.append('facture', selectedReservation.facture_id);
      formData.append('methode', paiementData.methode);
      formData.append('montant', paiementData.montant);
      formData.append('note', paiementData.note);
      if (paiementData.fichier_facture) {
        formData.append('fichier_facture', paiementData.fichier_facture);
      }
      console.log('dara history yyy :',formData);
      await createArchiveFactureHotel(formData);
      alert('Facture archivée avec succès');
      setOpenArchiveModal2(false);
    } catch (error) {
      console.error('Erreur archivage:', error);
      alert('Erreur lors de l’archivage');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'booking',
      headerName: 'booking',
      width: 200,
      renderCell: (params) => <span>{params.row?.booking?.id || '—'}--{params.row?.booking?.nom || '—'}</span>,
    },
    { field: 'numero_facture', headerName: 'numero_facture', width: 200 },
    { field: 'date_emission', headerName: 'date_emission', width: 200 },
    { field: 'prix_offre', headerName: 'prix_offre', width: 150 },
    { field: 'montant_total', headerName: 'montant_total', width: 150 },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 150,
      renderCell: (params) => {
        const value = params.value;
  
        let color = 'default';
        let label = '';
  
        switch (value) {
          case 'en_attente':
            color = 'warning';
            label = 'En attente';
            break;
          case 'confirmee':
            color = 'success';
            label = 'Confirmée';
            break;
          case 'annulee':
            color = 'error';
            label = 'Annulée';
            break;
          default:
            label = value;
        }
  
        return <Chip label={label} color={color} variant="outlined" />;
      }
    },
    {
      field: 'action',
      headerName: 'Statut_update',
      width: 200,
      renderCell: (params) => {
        const [value, setValue] = React.useState(params.row.statut);
        
    
        const handleChange = async (event) => {
          const newStatut = event.target.value;
          setValue(newStatut); 
        
          try {
            await updateFactureStatut(params.row.id, newStatut);
            
            params.api.updateRows([{ id: params.row.id, statut: newStatut }]);
          } catch (error) {
            console.error('Erreur lors de la mise à jour du statut :', error);
            alert('Erreur lors de la mise à jour du statut de la facture');
          }
        };
    
        return (
          <Select
            value={value || ''} 
            onChange={handleChange} 
            size="small"
            fullWidth
            variant="standard"
          >
            {(statutOptions || []).filter(Boolean).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Générer facture">
            <IconButton onClick={() => handleGenerateFacture(params.row)}>
              <DescriptionIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Archiver">
            <IconButton
              onClick={() => {
                setSelectedFacture(params.row);
                setOpenArchiveModal(true);
              }}
            >
              <ArchiveIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </>

      
      ),
    },

  ];
  const columns_reservations = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'date_reservation', headerName: 'Date Réservation', width: 120 },
    {
      field: 'client_nom',
      headerName: 'Client Nom',
      width: 80,
    },
    {
      field: 'client_type',
      headerName: 'Type Client',
      width: 80,
    },
    {
      field: 'client_telephone',
      headerName: 'Téléphone',
      width: 100,
    },
    {
      field: 'hotel_nom',
      headerName: 'Hôtel',
      width: 180,
    },
    {
      field: 'hotel_adresse',
      headerName: 'Adresse Hôtel',
      width: 100,
    },
    {
      field: 'numero_chambre',
      headerName: 'N° Chambre',
      width: 80,
    },
    {
      field: 'type_chambre',
      headerName: 'Type',
      width: 80,
    },
    { field: 'date_arrivee', headerName: 'Date Arrivée', width: 100 },
    { field: 'date_depart', headerName: 'Date Départ', width: 100 },
    {
      field: 'prix_par_nuit',
      headerName: 'Prix/Nuit',
      width: 70,
    },
    {
        field: 'get_nuits',
        headerName: 'Nuits',
        width: 70,
      },
      {
        field: 'get_total',
        headerName: 'Total',
        width: 70,
      },

      { 
        field: 'statut', 
        headerName: 'Statut', 
        width: 150,
        renderCell: (params) => {
          let color;
          let label;
    
          switch (params.value) {
            case 'en_attente':
              color = 'warning';
              label = 'En attente';
              break;
            case 'confirmee':
              color = 'success';
              label = 'Confirmée';
              break;
            case 'annulee':
              color = 'error';
              label = 'Annulée';
              break;
            default:
              color = 'default';
              label = params.value;
          }
    
          return <Chip label={label} color={color} size="small" />;
        }
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Générer facture">
              <IconButton onClick={() => handleGenerateFacture2(params.row)}>
                <DescriptionIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Archiver">
              <IconButton
                onClick={() => {
                  setSelectedReservation(params.row);
                  setOpenArchiveModal2(true);
                }}
              >
                <ArchiveIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </>
  
        
        ),
      },
    ]
  function convertirMontantEnLettres(montant) {
    const unite = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
    const dizaine = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];
    const dizaineExcep = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const dizaineExcepText = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  
    function convertNombre(n) {
      if (n === 0) return "zéro";
      if (n < 10) return unite[n];
      if (n < 20) return dizaineExcepText[n - 10];
      if (n < 100) {
        let d = Math.floor(n / 10);
        let u = n % 10;
        let sep = (u === 1 && (d === 1 || d === 7 || d === 9)) ? " et " : (u > 0 ? "-" : "");
        return dizaine[d] + sep + (u > 0 ? convertNombre(u + ((d === 7 || d === 9) ? 10 : 0)) : "");
      }
      if (n < 1000) {
        let c = Math.floor(n / 100);
        let r = n % 100;
        return (c > 1 ? unite[c] + " cent" : (c === 1 ? "cent" : "")) + (r > 0 ? " " + convertNombre(r) : "");
      }
      if (n < 1000000) {
        let m = Math.floor(n / 1000);
        let r = n % 1000;
        return (m > 1 ? convertNombre(m) + " mille" : "mille") + (r > 0 ? " " + convertNombre(r) : "");
      }
      return "montant trop grand";
    }
    const entier = Math.floor(montant);
    const centimes = Math.round((montant - entier) * 100);
    let texte = `${convertNombre(entier)} dirham${entier > 1 ? "s" : ""}`;
    if (centimes > 0) {
      texte += ` et ${convertNombre(centimes)} centime${centimes > 1 ? "s" : ""}`;
    }
    return texte;
  }


  return (
    <Sidebar>

     <Box
        sx={{
          p: 2,
          maxWidth: {
            xs: '100%',  
            sm: '600px',  
            md: '800px', 
            lg: '1300px'  
          },
          margin: '0 auto' 
        }}
      > 
      <h1>Factures</h1>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
        
        <DataGrid
            rows={factures}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowHeight={() => 'auto'}
            showCellVerticalBorder
            showColumnVerticalBorder
            checkboxSelection
            disableSelectionOnClick
        />
        {/* <Card sx={{ maxWidth: '1300px' ,minWidth: '600px' }} variant={'soft'} color={'primary'}>  */}
        <Typography level="title-md" textColor="inherit" gutterBottom>Gestion des Réservations</Typography>
        <DataGrid
            rows={reservations}
            columns={columns_reservations}
            autoHeight
            pageSize={5}
            getRowId={(row) => row.id}
        />
        {/* </Card> */}
        </>

      )}
    </Box>      
    <Modal open={!!selectedFacture} onClose={handleCloseModal}>
  <Box sx={style}>
    {selectedFacture && (() => {
      const nombre_per = parseFloat(selectedFacture.booking?.nombre_personnes|| 0);
      const montant_t = parseFloat(selectedFacture?.montant_total || 0);
      const montantHT = montant_t * nombre_per;
      const montantTVA = montantHT * TVA_RATE; // par exemple TVA_RATE = 0.2
      const montantTTC = montantHT + montantTVA;
      const montantTTCText = convertirMontantEnLettres(montantTTC);


      

      return (
        <>
        <Box ref={printRef} className="print-container">
          {/* En-tête facture */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ width: 60, marginRight: 16 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">Travel</Typography>
                <Typography variant="body2">+212 6 12 34 56 78</Typography>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="bold">Facture N°: {selectedFacture.numero_facture}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Émise le : {selectedFacture.date_emission}</Typography>
            </Box>
          </Box>

            {/* Contenu principal : infos client à gauche, résumé à droite */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap', mb: 3 }}>
              {/* Infos client */}
              <Box sx={{ flex: '1 1 45%' }}>

              </Box>

                {/* Résumé financier */}
              <Box sx={{ flex: '1 1 45%',justifyItems:'center' }}>
                <Typography variant="h6" gutterBottom></Typography>
                <Divider sx={{ mb: 0 }} />
                <Typography><strong>Nom :</strong> {selectedFacture.booking?.nom}</Typography>
                <Typography><strong>Email :</strong> {selectedFacture.booking?.email}</Typography>
                <Typography><strong>Téléphone :</strong> {selectedFacture.booking?.telephone}</Typography>
                <Typography><strong>Nombre de personnes :</strong> {selectedFacture.booking?.nombre_personnes}</Typography>
                <Typography><strong>Date de réservation :</strong>   {new Date(selectedFacture.booking?.date_reservation).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
                <Typography><strong>Réservation N°:</strong>{selectedFacture.booking?.id}</Typography>
              </Box>
            </Box>

            {/* Offre choisie */}
            <Box sx={{ mb: 0 }}>
              <Divider sx={{ mb: 1 }} />
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>Offre</strong></TableCell>
                      <TableCell><strong>Nomber Per</strong></TableCell>
                      <TableCell align="right"><strong>Prix/per (MAD)</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{selectedFacture.booking?.offre?.titre}</TableCell>
                      <TableCell>{selectedFacture.booking?.nombre_personnes} X</TableCell>
                      <TableCell align="right">{selectedFacture.prix_offre}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Options supplémentaires */}
            {selectedFacture.options_extras?.length > 0 && (
              <Box sx={{ mb: 1 }}>
                
                <Divider sx={{ mb: 0 }} />
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell><strong >Options supplémentaires</strong></TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedFacture.options_extras.map((opt, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{opt.nom}</TableCell>
                          <TableCell align="right">{opt.prix}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap', mb: 3 }}>
              {/* Infos client */}
              <Box sx={{ flex: '1 1 45%' }}>

              </Box>

                {/* Résumé financier */}
              <Box sx={{ flex: '1 1 5%' }}>
                <Divider sx={{ mb: 0 }} />
                <Box sx={{ display: 'flex' }}>
                  <Typography>Montant HT :</Typography>
                  <Typography>{montantHT.toFixed(2)} MAD</Typography>
                </Box>
                <Box sx={{ display: 'flex',  }}>
                  <Typography>TVA (20%) :</Typography>
                  <Typography>{montantTVA.toFixed(2)} MAD</Typography>
                </Box>
                <Box sx={{ display: 'flex', fontWeight: 'bold' }}>
                  <Typography>Total TTC :</Typography>
                  <Typography>{montantTTC.toFixed(2)} MAD</Typography>
                </Box>
              </Box>
            </Box>
         <Typography><strong>montantTTC :</strong> # ' {montantTTCText} ' #</Typography>

          {/* Footer entreprise */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Contact : contact@travel.com | +212 6 12 34 56 78
            </Typography>
            <Typography variant="body2">
              Adresse : Route 123, Rabat - Maroc
            </Typography>
          </Box>

      </Box>
      {/* Bouton de fermeture */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={handleExportPDF}>
          Imprimer / PDF
        </Button>
        <Button variant="contained" onClick={handleCloseModal}>
          Fermer
        </Button>
      </Box>
    </>
      );
    })()}
  </Box>
  
</Modal>
<Modal open={!!selectedReservation} onClose={handleCloseModal2}>
  <Box sx={style}>
    {selectedReservation && (() => {
      const nuits = parseInt(selectedReservation.get_nuits || 0);
      const prixParNuit = parseFloat(selectedReservation.prix_par_nuit || 0);
      const total = parseFloat(selectedReservation.get_total || nuits * prixParNuit);
      const montantHT = total ;
      const montantTVA = montantHT * TVA_RATE; // par exemple TVA_RATE = 0.2
      const TTC_total  = montantHT + montantTVA;
      const montantTTCText = convertirMontantEnLettres(TTC_total );

      return (
        <>
        <Box ref={printRef} className="print-container">
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6">Détails Réservation</Typography>
              <Typography variant="body2">N° : {selectedReservation.facture_numero}</Typography>
              <Typography variant="body2">Date : {selectedReservation.facture_date_facture}</Typography>
            </Box>
          </Box>

          {/* Infos client et hôtel */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ flex: '1 1 45%' }}>
              <Typography><strong>Client :</strong> {selectedReservation.client_nom}</Typography>
              <Typography><strong>Type :</strong> {selectedReservation.client_type}</Typography>
              <Typography><strong>Téléphone :</strong> {selectedReservation.client_telephone}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <Typography><strong>Hôtel :</strong> {selectedReservation.hotel_nom}</Typography>
              <Typography><strong>Adresse :</strong> {selectedReservation.hotel_adresse}</Typography>
              <Typography><strong>Chambre :</strong> {selectedReservation.numero_chambre} ({selectedReservation.type_chambre})</Typography>
            </Box>
          </Box>

          {/* Détails séjour */}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ mb: 2 }}>
            <Typography><strong>Date d’arrivée :</strong> {selectedReservation.date_arrivee}</Typography>
            <Typography><strong>Date de départ :</strong> {selectedReservation.date_depart}</Typography>
            <Typography><strong>Nombre de nuits :</strong> {nuits}</Typography>
            <Typography><strong>Prix par nuit :</strong> {prixParNuit.toFixed(2)} MAD</Typography>
            <Typography><strong>Total :</strong> {total.toFixed(2)} MAD</Typography>
          </Box>

          <Box sx={{ flex: '1 1 5%' }}>
            <Divider sx={{ mb: 0 }} />
            <Box sx={{ display: 'flex' }}>
              <Typography>Montant HT :</Typography>
              <Typography>{montantHT.toFixed(2)} MAD</Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography>TVA (20%) :</Typography>
              <Typography>{montantTVA.toFixed(2)} MAD</Typography>
            </Box>
            <Box sx={{ display: 'flex', fontWeight: 'bold' }}>
              <Typography>Total TTC :</Typography>
              <Typography>{TTC_total.toFixed(2)} MAD</Typography>
            </Box>
          </Box>
          <Typography><strong>montantTTC :</strong> # ' {montantTTCText} ' #</Typography>

          {/* Footer */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">Travel Booking System</Typography>
            <Typography variant="body2">Contact : contact@travel.com | +212 6 12 34 56 78</Typography>
          </Box>
        </Box>
          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button variant="outlined" onClick={handleExportPDF2}>
            Imprimer / PDF
          </Button>
            <Button variant="contained" onClick={handleCloseModal}>Fermer</Button>
          </Box>
        </>
      );
    })()}
  </Box>
</Modal>

<Dialog open={openArchiveModal} onClose={() => setOpenArchiveModal(false)} fullWidth maxWidth="sm">
  <DialogTitle>Archiver la facture</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      margin="normal"
      label="Méthode de paiement"
      select
      value={paiementData.methode}
      onChange={(e) => setPaiementData({ ...paiementData, methode: e.target.value })}
    >
      <MenuItem value="carte_bancaire">Carte Bancaire</MenuItem>
      <MenuItem value="virement">Virement Bancaire</MenuItem>
      <MenuItem value="cheque">Chèque</MenuItem>
      <MenuItem value="espèces">Espèces</MenuItem>
    </TextField>

    <TextField
      fullWidth
      margin="normal"
      label="Montant"
      type="number"
      value={paiementData.montant}
      onChange={(e) => setPaiementData({ ...paiementData, montant: e.target.value })}
    />

    <TextField
      fullWidth
      margin="normal"
      label="Note"
      multiline
      rows={3}
      value={paiementData.note}
      onChange={(e) => setPaiementData({ ...paiementData, note: e.target.value })}
    />

    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={(e) =>
        setPaiementData({ ...paiementData, fichier_facture: e.target.files[0] })
      }
      style={{ marginTop: '1rem' }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenArchiveModal(false)}>Annuler</Button>
    <Button onClick={handlePaiementSubmit} variant="contained" color="primary">
      Archiver
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={openArchiveModal2} onClose={() => setOpenArchiveModal2(false)} fullWidth maxWidth="sm">
  <DialogTitle>Archiver la facture</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      margin="normal"
      label="Méthode de paiement"
      select
      value={paiementData.methode}
      onChange={(e) => setPaiementData({ ...paiementData, methode: e.target.value })}
    >
      <MenuItem value="carte_bancaire">Carte Bancaire</MenuItem>
      <MenuItem value="virement">Virement Bancaire</MenuItem>
      <MenuItem value="cheque">Chèque</MenuItem>
      <MenuItem value="espèces">Espèces</MenuItem>
    </TextField>

    <TextField
      fullWidth
      margin="normal"
      label="Montant"
      type="number"
      value={paiementData.montant}
      onChange={(e) => setPaiementData({ ...paiementData, montant: e.target.value })}
    />

    <TextField
      fullWidth
      margin="normal"
      label="Note"
      multiline
      rows={3}
      value={paiementData.note}
      onChange={(e) => setPaiementData({ ...paiementData, note: e.target.value })}
    />

    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={(e) =>
        setPaiementData({ ...paiementData, fichier_facture: e.target.files[0] })
      }
      style={{ marginTop: '1rem' }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenArchiveModal2(false)}>Annuler</Button>
    <Button onClick={handlePaiementSubmit2} variant="contained" color="primary">
      Archiver
    </Button>
  </DialogActions>
</Dialog>
    </Sidebar>

  );
};

export default BookingFact;
