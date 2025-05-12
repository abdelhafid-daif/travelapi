import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getArchiveFacture ,getSecureFileUrl,getArchiveFactureHotel} from '../../api/part'; 
import {  Grid, Box, Typography, CircularProgress,Tooltip,IconButton} from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { Chip } from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import DownloadIcon from '@mui/icons-material/Download';

const HistoriquePaiementForm = () => {
    const [factures, setFactures] = useState([]);
    const [factureshotel, setFacturesHotel] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

  
    useEffect(() => {
      const fetchArchiveData = async () => {
        try {
          const response = await getArchiveFacture();
          console.log('archive',response.data);
          setFactures(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          setError("Impossible de récupérer data Booking. Vérifiez vos permissions.");
        } finally {
          setLoading(false); 
        }
      };
      const fetchArchiveDataHotel = async () => {
        try {
          const response = await getArchiveFactureHotel();
          console.log('archive',response.data);
          setFacturesHotel(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          setError("Impossible de récupérer data Booking. Vérifiez vos permissions.");
        } finally {
          setLoading(false); 
        }
      };
  
      fetchArchiveData();
      fetchArchiveDataHotel();
    }, []);
    const totalCount = factures.length;

    const handleDownload = (fileName) => {
      const fileUrl = getSecureFileUrl(fileName);
    
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

    const columns = [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'facture', headerName: 'facture', width: 80 },
      { field: 'date_paiement', headerName: 'date_paiement', width: 100 },
      { field: 'montant', headerName: 'montant', width: 100 },
      { field: 'methode', headerName: 'methode', width: 100 },
      { field: 'note', headerName: 'note', width: 100 },
      { field: 'comptable', headerName: 'comptable', width: 100 },
      {
        field: 'fichier_facture',
        headerName: 'Télécharger Facture',
        width: 180,
        renderCell: (params) => {
          const fileName = params.row.fichier_facture.split('/').pop();  
          return (

                      <Tooltip title="Download">
                      <IconButton onClick={() => handleDownload(fileName)}>
                        <DownloadIcon color="primary" />
                      </IconButton>
                    </Tooltip>
          );
        },
      },
    ];
    const columnshotel = [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'facture', headerName: 'facture', width: 80 },
      { field: 'date_paiement', headerName: 'date_paiement', width: 100 },
      { field: 'montant', headerName: 'montant', width: 100 },
      { field: 'methode', headerName: 'methode', width: 100 },
      { field: 'note', headerName: 'note', width: 100 },
      { field: 'comptable', headerName: 'comptable', width: 100 },
      {
        field: 'fichier_facture',
        headerName: 'Télécharger Facture',
        width: 180,
        renderCell: (params) => {
          const fileName = params.row.fichier_facture.split('/').pop(); 
          return (

                      <Tooltip title="Download">
                      <IconButton onClick={() => handleDownload(fileName)}>
                        <DownloadIcon color="primary" />
                      </IconButton>
                    </Tooltip>
          );
        },
      },
    ];  
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
          <Typography variant="h4" gutterBottom>
            Archive Factures
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Grid container spacing={2} marginBottom={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Chip variant="outlined" color="primary" icon={<FunctionsIcon />} label={`Total: ${totalCount}`} sx={{ fontSize: '1rem', padding: '10px' }} />
          </Grid>
        </Grid>
          <Box display="flex" gap={4} flexWrap="wrap">
            {/* Tableau à gauche */}
            <Box flex={2} minWidth="300px">
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <DataGrid rows={factures} columns={columns} autoHeight pageSize={5} />
                  <DataGrid rows={factureshotel} columns={columnshotel} autoHeight pageSize={5} />
                </>

              )}
            </Box>
          </Box>
        </Box>
      </Sidebar>
    );
  };
  
  export default HistoriquePaiementForm;
  