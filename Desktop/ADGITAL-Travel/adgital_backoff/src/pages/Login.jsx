import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getUserRole } from '../api/users';
import {
  Box,
  Button,
  Input,
  Typography,
  Alert,
  Divider,
  Stack,
  Link,
} from '@mui/joy';
import {
  TextField ,
Paper,
Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import '../App.css';
import Key from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import Chip from '@mui/joy/Chip';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';


const CustomInput = styled(Input)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5),
  },
  '& .MuiInputBase-formControl': {
    borderRadius: theme.shape.borderRadius,
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      const role = await getUserRole();

      // Redirection selon le rôle
      switch (role) {
        case 'manager':
          navigate('/manager');
          break;
        case 'commercial':
          navigate('/commercial');
          break;
        case 'support':
          navigate('/support');
          break;
        case 'comptable':
          navigate('/comptable');
          break;        
        default:
          navigate('/not');
          break;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

      }}
    >
      
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          background: '#ffffff', // Updated gradient
          backgroundSize: '400% 400%',
          animation: ' 10s ease-in-out infinite', // Flow animation with infinite loop
        }}
      >
  <Box component="img" src="/logo4.svg" alt="ADGITAL" sx={{ width: 180, height: 180, mr: 0 ,p:0}} />

        {/* <Avatar sx={{ bgcolor: 'primary.main', margin: '0 auto', mb: 2 }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography  fontWeight="bold" mb={2}  sx={{ pt:0,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Adding shadow effect
    color: '#364152', // Custom text color
    fontSize: '25px',
  }}>
         Welcome back !
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

<form onSubmit={handleLogin} >
<Stack spacing={2} sx={{mt: 5}}>
          <Input 
            fullWidth
            placeholder="Nom d'utilisateur"
            color="primary" 
            variant="soft"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input 
            fullWidth
            placeholder="Mot de passe"
            type="password"
            color="primary" 
            variant="soft"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

  </Stack>
          <Button
            type="submit"
            fullWidth

            variant="solid"
            sx={{ mt: 6, mb: 1 }}
          >
            Connexion
          </Button>
        </form>
        <Link   mt={2}>
          Support.
        </Link >
      </Paper>
      <Typography
      fontWeight="bold"
    sx={{
      position: 'absolute',
      left: 10,
      bottom: 10,
      color: '#364152', // Adjust text color
      fontSize: '12px', // Optional font size
    }}
  >
    © 2025 ADGITAL - TAS v.1
  </Typography>

  {/* Right Footer Text */}
  <Typography
  fontWeight="bold"
    sx={{
      position: 'absolute',
      right: 10,
      bottom: 10,
      color: '#364152', // Adjust text color
      fontSize: '12px', // Optional font size
    }}
  >
    Tous droits réservés
  </Typography>
    </Box>
  
  
  );
};

export default Login;
