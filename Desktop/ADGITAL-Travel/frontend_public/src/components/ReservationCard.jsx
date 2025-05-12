import {
    Card,
    CardContent,
    Typography,
    Input,
    Button,
    Stack,
    Divider,
    Textarea,
    Box,
  } from '@mui/joy';
  import React, { useState } from 'react';
  import axios from 'axios';
  import {
    Person,
    Email,
    Phone,
    PeopleAlt,
    ChatBubbleOutline,
  } from '@mui/icons-material';
  import PaymentMethodSelect from './PaymentMethodSelect';
  import { Modal, ModalDialog } from '@mui/joy';

  
  const ReservationCard = ({ depart }) => {
    const [methode, setMethode] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
      nom: '',
      email: '',
      telephone: '',
      nombre_personnes: '',
      message: '',
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post('http://localhost:8000/booking-payment/', {
          ...formData,
          methode,
          offre: depart?.id, // Utilise depart.id si c’est l'offre
        });
        setMessageSuccess('Réservation et paiement enregistrés avec succès !');
        // Optionnel : réinitialiser le formulaire après succès
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          nombre_personnes: '',
          message: '',
        });
        setMethode('');
        setOpenModal(true);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
        <>

      <Card
  variant="soft"
  sx={{
    width: { xs: '100%', md: 400 },
    mx: 'auto',
    p: 3,
    boxShadow: 6,
    bgcolor: 'background.level1', borderRadius: 'lg'
  }}
  
>
  <CardContent>
  <Box
  sx={{
    backgroundColor: '#fff', // rose très clair
    borderRadius: 2,
    paddingY: 1.5,
    paddingX: 2,
    mb: 3,
    border: '1px solid transparent',
  }}
>
  <Typography
    variant="h5"
    fontWeight="bold"
    color="#C70039"
    textAlign="center"
  >
    Réservation Rapide
  </Typography>
</Box>

    <Divider sx={{ mb: 1 }} />

    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Input
          startDecorator={<Person sx={{ color: '#C70039' }} />}
          placeholder="Nom complet"
          variant="outlined"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />
        <Input
          startDecorator={<Email sx={{ color: '#C70039' }} />}
          placeholder="Adresse email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          startDecorator={<Phone sx={{ color: '#C70039' }} />}
          placeholder="Téléphone"
          type="tel"
          variant="outlined"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          required
        />
        <Input
          startDecorator={<PeopleAlt sx={{ color: '#C70039' }} />}
          placeholder="Nombre de personnes"
          type="number"
          variant="outlined"
          value={formData.nombre_personnes}
          onChange={(e) => setFormData({ ...formData, nombre_personnes: e.target.value })}
          required
        />
        <Textarea
          minRows={3}
          placeholder="Message (facultatif)"
          variant="outlined"
          startDecorator={<ChatBubbleOutline sx={{ color: '#C70039' }} />}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />

        <PaymentMethodSelect value={methode} onChange={setMethode} />

        <Button
          type="submit"
          fullWidth
          sx={{
            background: 'linear-gradient(to right, #C70039, #a0002a)',
            color: 'white',
            fontWeight: 'bold',
            py: 1.2,
            borderRadius: 3,
            '&:hover': {
              background: 'linear-gradient(to right, #a0002a, #C70039)',
            },
          }}
        >
          🐎 Réserver maintenant
        </Button>

        {messageSuccess && (
          <Typography color="success" fontSize={14} textAlign="center">
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
  
  export default ReservationCard;
  