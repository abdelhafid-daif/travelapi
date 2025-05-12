import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Checkbox, FormControlLabel, CircularProgress, Alert ,Box,Typography ,useTheme, useMediaQuery } from '@mui/material';
import { getBookingConfermed, createFacture } from '../../api/part';
import Sidebar from '../../components/Sidebar';
import FactureForm from '../../components/FactureForm';
import { Modal } from '@mui/material';


const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enabled, setEnabled] = React.useState(true);
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [factureData, setFactureData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getBookingConfermed();
        console.log('data:',response.data);
        setBookings(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Erreur lors du chargement des données de réservation.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleOptionChange = (bookingId, optionId) => {
    setSelectedOptions((prevState) => {
      const bookingOptions = prevState[bookingId] || [];
      if (bookingOptions.includes(optionId)) {
        return {
          ...prevState,
          [bookingId]: bookingOptions.filter((option) => option !== optionId),
        };
      } else {
        return {
          ...prevState,
          [bookingId]: [...bookingOptions, optionId],
        };
      }
    });
  };

  const handleSaveFacture = (updatedFacture) => {
    console.log('Facture sauvegardée :', updatedFacture);
    setShowFactureModal(false);
  };
  
  const handleOpenModal = (params) => {
    const bookingId = params.row.id;
    const allOptions = params.row.options_extras || [];
    const selectedIds = selectedOptions[bookingId] || [];
  
    const selectedOptionObjects = allOptions.filter((opt) =>
      selectedIds.includes(opt.id)
    );
  
    setFactureData({
      bookingId,
      options_extras: selectedOptionObjects, 
    });
  
    setShowFactureModal(true);
  };
  

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'nom', headerName: 'Nom', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'offre',
      headerName: 'Offre',
      width: 200,
      renderCell: (params) => <span>{params.row?.offre?.titre || '—'}</span>,
    },
    { field: 'statut', headerName: 'Statut', width: 150 },
    {
        field: 'options_extras',
        headerName: 'Options Supplémentaires',
        width: 400,
        renderCell: (params) => {
          const options = params.row.options_extras || [];
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 200, overflowY: 'auto' }}>
              {options.length > 0 ? (
                options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    control={
                      <Checkbox
                        checked={selectedOptions[params.row.id]?.includes(option.id) || false}
                        onChange={() => handleOptionChange(params.row.id, option.id)}
                      />
                    }
                    label={`${option.nom} - ${option.prix} MAD`}
                  />
                ))
              ) : (
                <Typography>Aucune option</Typography>
              )}
            </Box>
          );
        },
      },
      {
        field: 'action',
        headerName: 'Actions',
        width: 180,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal(params)}
          >
            Compléter la facture
          </Button>
        ),
      }
  ];

  return (
    <Sidebar>
<Modal
  open={showFactureModal}
  onClose={() => setShowFactureModal(false)}
  aria-labelledby="facture-modal-title"
  aria-describedby="facture-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    }}
  >
    <FactureForm facture={factureData} onSave={handleSaveFacture} />
  </Box>
</Modal>

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
  <h1 style={{ fontSize: isMobile ? '1.4rem' : '2rem' }}>Réservations Confirmées</h1>

  {error && <Alert severity="error">{error}</Alert>}

  {loading ? (
    <CircularProgress />
  ) : (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={bookings}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowHeight={() => 'auto'}
        showCellVerticalBorder
        showColumnVerticalBorder
        checkboxSelection
        disableSelectionOnClick
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      />
    </Box>
  )}
</Box>
    </Sidebar>

  );
};

export default BookingPage;
