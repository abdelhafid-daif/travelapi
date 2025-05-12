import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Card,
    Chip,
    List,
    ListItem,
    ListItemDecorator,
    ListItemContent
  } from '@mui/joy';
import Badge from '@mui/joy/Badge';
import { fetchUsersStatus  } from '../api/users'; 
import API_URL from '../api/users'; 
import { formatDistanceToNow } from 'date-fns';

const UserCards = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsersStatus();
        console.log('data online:',data );
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    };

    loadUsers();
  }, []);

  return (
//     <Box
//     sx={{
//       width: '100%',
//       maxWidth: 300,
//       mx: 'auto',
//       mt: 4,
//       px: 2,
//     }}
//   >
//     <Typography level="h4" sx={{ mb: 2, textAlign: 'center' }}>
//       Utilisateurs connectés
//     </Typography>

//     <Card
//       variant="soft"
//       sx={{
//         p: 2,
//         borderRadius: 'lg',
//         boxShadow: 'lg',
//       }}
//     >
//       <List sx={{ gap: 2 }}>
//         {users.map((user) => (
//           <ListItem key={user.id} sx={{ alignItems: 'flex-start' }}>
            
//             <ListItemDecorator>
//              <Avatar src={`${API_URL}${user.avatar}`} alt={user.username} size="lg" />

//             </ListItemDecorator>
//             <ListItemContent>
//               <Typography level="title-md">{user.username}</Typography>
//               <Typography level="body-sm" color="neutral">
//                 {user.email}
//               </Typography>
//               <Typography level="body-xs" color="neutral">
//                 📍 {user.city || 'Ville inconnue'}
//               </Typography>
//               <Box mt={1}>
//                 <Chip
//                   size="sm"
//                   variant="solid"
//                   color={user.is_online ? 'success' : 'neutral'}
//                 >
//                   {user.is_online ? '✅ En ligne' : '⛔ Hors ligne'}
//                 </Chip>
//               </Box>
//             </ListItemContent>
//           </ListItem>
//         ))}
//       </List>
//     </Card>
//   </Box>
      <Box sx={{ width: 280 }}>
      <Typography
        id="ellipsis-list-demo"
        level="body-xs"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.15rem' }}
      >
        Inbox
      </Typography>
      <List
        aria-labelledby="ellipsis-list-demo"
        sx={{ '--ListItemDecorator-size': '56px' }}
      >
        {users.map((user) => (
            <ListItem key={user.id}>
            <ListItemDecorator>
                <Badge color={user.is_online ? 'success' : 'danger'}/>
                <Avatar src={`${API_URL}${user.avatar}`} alt={user.username} />
            </ListItemDecorator>
            <ListItemContent>
                <Typography level="title-sm">{user.username}</Typography>
                <Typography level="body-sm" noWrap>
                &apos;{user.email}
                </Typography>
                <Typography level="body-xs" noWrap>
                    {user.last_connection
                        ? formatDistanceToNow(new Date(user.last_connection), { addSuffix: true })
                        : 'Never connected'}
                </Typography>
            </ListItemContent>
            </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserCards;
