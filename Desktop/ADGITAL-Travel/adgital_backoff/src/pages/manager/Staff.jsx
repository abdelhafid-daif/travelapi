import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Switch, TextField, Avatar,Stack ,Typography,Box ,Grid,Button} from '@mui/material';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import {getStaff ,updateStaff} from '../../api/part';
import {deleteAllGroupMessages} from '../../api/chat';
import UserCards from '../../components/UserCards';
import GroupChat from '../../components/GroupChat';
import DeleteIcon from '@mui/icons-material/Delete';

const Staff = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
       getStaff().then(res => setStaff(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUpdate = (id, field, value) => {
    const updated = staff.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setStaff(updated);

    updateStaff(id, { [field]: value })
      .catch(err => console.error(err));
  };

  const columns = [
    {
        field: 'user',
        headerName: 'User',
        width: 300,
        renderCell: (params) => {
          const { avatar, user  } = params.row;
          return (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar alt={user.username} src={avatar} />
              <Stack>
                <Typography variant="subtitle2">{user.username}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>

              </Stack>
            </Stack>
          );
        },
      },
    {
      field: 'bio',
      headerName: 'Bio',
      width: 200,
      renderCell: (params) => (
        <TextField
          variant="standard"
          value={params.value}
          onChange={(e) => handleUpdate(params.row.id, 'bio', e.target.value)}
          fullWidth
        />
      ),
    },
    ...[ 'is_commercial', 'is_support', 'is_manager', 'is_comptable'].map(field => ({
      field,
      headerName: field.replace('is_', '').replace('_', ' ').toUpperCase(),
      width: 150,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={(e) => handleUpdate(params.row.id, field, e.target.checked)}
          color="primary"
        />
      ),
    })),

  ];
  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all messages?")) {
      deleteAllGroupMessages()
        .then(() => {
          alert("All messages deleted");
          // rafraîchir messages si besoin
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Sidebar>

    <Box
          sx={{
            p: 2,
            maxWidth: {
              xs: '100%',  
              sm: '600px', 
              md: '800px', 
              lg: '1400px' 
            },
            margin: '0 auto'  
          }}
        >
      <Button variant="contained" color="error" endIcon={<DeleteIcon />} onClick={handleDeleteAll}>
        Delete All Messages
      </Button>
        <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Colonne gauche - Chat - large */}
        <Grid item xs={12} md={10} size={8} >
           <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                height: '100%',
                boxShadow: 3,
              }}
            >
                       <GroupChat />

          </Box>
        </Grid>

        {/* Colonne droite - Utilisateurs en ligne - petite */}
        <Grid xs={16} md={2} size={4}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                height: '100%',
                boxShadow: 3,
              }}
            >
              <UserCards />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={staff}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
      />
    </Box>
    </Box>
    </Sidebar>
  );
};

export default Staff;
