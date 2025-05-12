import { Box, Typography, Button, List, ListItem, ListItemDecorator, Divider } from '@mui/joy';
import { CreditCard, Store, AccountBalance, Receipt } from '@mui/icons-material';

const PaymentMethodSelect = ({ value, onChange }) => {
  const paymentMethods = [
    {
      value: 'carte_bancaire',
      icon: <CreditCard />,
      label: 'Carte Bancaire',
      description: 'Payer en ligne avec une carte'
    },
    {
      value: 'sur_place',
      icon: <Store />,
      label: 'Paiement sur place',
      description: 'Payer directement à l’arrivée'
    },
    {
      value: 'virement_bancaire',
      icon: <AccountBalance />,
      label: 'Virement bancaire',
      description: 'Transférer depuis votre banque'
    },
    {
      value: 'cheque',
      icon: <Receipt />,
      label: 'Chèque',
      description: 'Envoyer ou déposer un chèque'
    }
  ];

  return (
    <Box>
      <Typography level="h6" fontWeight="bold" color="#C70039" mb={2}>
        Choisissez une méthode de paiement
      </Typography>
      <List sx={{ padding: 0 }}>
        {paymentMethods.map((method) => (
          <ListItem
            key={method.value}
            onClick={() => onChange(method.value)}
            sx={{
              cursor: 'pointer',
              backgroundColor: value === method.value ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            <ListItemDecorator>{method.icon}</ListItemDecorator>
            <Box>
              <Typography fontWeight="md">{method.label}</Typography>
              <Typography level="body-sm">{method.description}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default PaymentMethodSelect;
