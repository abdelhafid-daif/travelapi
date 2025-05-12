import {
    Card,
    CardContent,
    Typography,
    Input,
    Button,
    Stack,
    Divider,
    Textarea,
    Select, Option,
  } from '@mui/joy';
  import React, { useState } from 'react';
  import {
    Person,
    Email,
    Phone,
    PeopleAlt,
    ChatBubbleOutline,
  } from '@mui/icons-material';
  import axios from 'axios';
  import {createReservation} from '../api/api';
  import PaymentMethodSelect from './PaymentMethodSelect';
  import { Modal, ModalDialog } from '@mui/joy';
  import dayjs from 'dayjs';
  
  const ReservationHotel = ({ chambre, onBack, onSubmit }) => {
    const [messageSuccess, setMessageSuccess] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const [client, setClient] = useState({
      nom: '',
      type_client: 'particulier',
      email: '',
      telephone: '',
      adresse: '',
    });
    const [dates, setDates] = useState({
      date_arrivee: '',
      date_depart: '',
    });
  
    const handleChange = (field, value) => {
      setClient({ ...client, [field]: value });
    };
  
    const handleDateChange = (field, value) => {
      setDates({ ...dates, [field]: value });
    };
  
    const handleSubmit = async () => {
      if (!client.nom || !dates.date_arrivee || !dates.date_depart) {
        alert("Veuillez remplir les champs obligatoires.");
        return;
      }
    
      const reservation = {
        client,
        chambre: chambre.id,
        date_arrivee: dates.date_arrivee,
        date_depart: dates.date_depart,
      };
    
      try {
        await createReservation(reservation);
        setOpenModal(true);
      } catch (error) {
        alert("Une erreur est survenue lors de la réservation.");
      }
      
      
      setOpenModal(true);
    };
  
  
    return (
        <>
      <Card
        variant="outlined"
        sx={{
          width: { xs: '100%', md: 360 },
          paddingRight: 2,
          right: 0,
          zIndex: 10,
          backgroundColor: 'white',
          border: '2px solid #C70039',
          boxShadow: 'lg',
          borderRadius: 'lg',
        }}
      >
        <CardContent>
        <Typography level="h4" mb={2}>
          Réserver la chambre #{chambre?.numero ?? '...'}
        </Typography>
          <Divider sx={{ mb: 2 }} />
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Input
                startDecorator={<Person />}
                variant="soft"
                placeholder="Nom du client *"
                value={client.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
              />
              <Select
                value={client.type_client}
                onChange={(_, value) => handleChange('type_client', value)}
                defaultValue="particulier"
              >
                <Option value="particulier">Particulier</Option>
                <Option value="entreprise">Entreprise</Option>
                <Option value="groupe">Groupe</Option>
                <Option value="scolaire">Scolaire</Option>
              </Select>
              <Input
                placeholder="Email"
                type="email"
                value={client.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <Input
                placeholder="Téléphone"
                value={client.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
              />
              <Input
                placeholder="Adresse"
                value={client.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
               />
               <Input
                type="date"
                placeholder="Date d'arrivée *"
                value={dates.date_arrivee}
                onChange={(e) => handleDateChange('date_arrivee', e.target.value)}
                required
               />
               <Input
                type="date"
                placeholder="Date de départ *"
                value={dates.date_depart}
                onChange={(e) => handleDateChange('date_depart', e.target.value)}
                required
              />
               <Button variant="plain" color="neutral" onClick={onBack}>Retour</Button>
               <Button variant="solid" color="primary" onClick={handleSubmit}>Confirmer la réservation</Button>
       
              {messageSuccess && (
                <Typography color="success" level="body-sm">
                  {messageSuccess}
                </Typography>
              )}
            </Stack>
          </form>
        </CardContent>
      </Card>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <ModalDialog sx={{ p: 4, textAlign: 'center' }}>
        <Typography level="h4" fontWeight="bold" color="success">
          🎉 Merci pour votre réservation !
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Nous vous contacterons dans quelques minutes pour confirmer les détails.
        </Typography>
        <Button
          onClick={() => setOpenModal(false)} 
          sx={{ mt: 3, backgroundColor: '#C70039', color: 'white' }}
          variant="solid"
        >
          Fermer
        </Button>
      </ModalDialog>
    </Modal>
    </>

    );
  };
  
  export default ReservationHotel;
  