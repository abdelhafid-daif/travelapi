import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/users';
import {
  Box,
  Button,
  Input,
  Typography,
  Alert
} from '@mui/joy';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    adresse: '',
    city: '',
    phone_number: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f9fafb"
    >
      <Box width={400} p={4} borderRadius="lg" boxShadow="md" bgcolor="white">
        <Typography level="h3" textAlign="center" mb={2}>Inscription</Typography>

        {error && <Alert color="danger" variant="soft">{error}</Alert>}

        <form onSubmit={handleRegister}>
          <Input placeholder="Nom d'utilisateur" name="username" value={form.username} onChange={handleChange} required sx={{ mb: 2 }} />
          <Input placeholder="Email" name="email" type="email" value={form.email} onChange={handleChange} required sx={{ mb: 2 }} />
          <Input placeholder="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} required sx={{ mb: 2 }} />
          <Input placeholder="Adresse" name="adresse" value={form.adresse} onChange={handleChange} sx={{ mb: 2 }} />
          <Input placeholder="Ville" name="city" value={form.city} onChange={handleChange} sx={{ mb: 2 }} />
          <Input placeholder="Téléphone" name="phone_number" value={form.phone_number} onChange={handleChange} sx={{ mb: 2 }} />

          <Button type="submit" fullWidth>S'inscrire</Button>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
