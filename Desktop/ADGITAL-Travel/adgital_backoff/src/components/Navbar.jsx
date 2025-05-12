import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Box,Stack ,Chip,Divider ,Drawer } from '@mui/material';
import Button from '@mui/joy/Button';
import { Logout, AccountCircle } from '@mui/icons-material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {getUser} from "../api/users";
import { useNavigate } from 'react-router-dom';
import Input from '@mui/joy/Input';
import { useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import GroupChat from './GroupChat';
import CloseIcon from '@mui/icons-material/Close';
import SmsIcon from '@mui/icons-material/Sms';



const Navbar = () => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
    const handleMobileMenuOpen = (e) => setMobileAnchorEl(e.currentTarget);
    const handleMobileMenuClose = () => setMobileAnchorEl(null);

    const [openChat, setOpenChat] = useState(false);


    const mediaUrl = import.meta.env.VITE_MEDIA_URL;


  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userData = await getUser();
          console.log('data user',userData);
          setUser(userData);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchUser();
    }, []);
  
    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      localStorage.removeItem('access_token');
      navigate('/login');
    };
    const avatarSrc = user?.profile?.avatar
      ? `${mediaUrl}${user.profile.avatar}`
      : undefined;

      const toggleChat = () => {
        setOpenChat(!openChat);
      };

    return (
      <AppBar 
        position="sticky" 
        sx={{
            backgroundColor: '#f8fafc',
            padding: 0,
            boxShadow:0,
            marginRight:4,
            height:'60px',
            marginLeft: isMobile ? '50px' : 0,
          }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Gauche : Menu Mobile */}
          {isMobile && (
            <>
              <IconButton onClick={handleMobileMenuOpen} color="primary">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileAnchorEl}
                open={Boolean(mobileAnchorEl)}
                onClose={handleMobileMenuClose}
              >
                <MenuItem>
                  <Input
                    color="primary"
                    placeholder="Recherche"
                    size="sm"
                    variant="solid"
                    fullWidth
                  />
                </MenuItem>
                <MenuItem>
                  <SupportAgentIcon sx={{ fontSize: 16, color: '#AAABAE' }} />
                  Option 1
                </MenuItem>
                <MenuItem>
                  <SupportAgentIcon sx={{ fontSize: 16, color: '#AAABAE' }} />
                  Option 2
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Milieu : (vide ou titre) */}
          {!isMobile && (
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ flexGrow: 1 }}>
               <>
              <IconButton onClick={handleMobileMenuOpen} color="primary">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileAnchorEl}
                open={Boolean(mobileAnchorEl)}
                onClose={handleMobileMenuClose}
              >
                <MenuItem>
                  <Input
                    color="primary"
                    placeholder="Recherche"
                    size="sm"
                    variant="solid"
                    fullWidth
                  />
                </MenuItem>
                <MenuItem>
                  <SupportAgentIcon sx={{ fontSize: 16, color: '#AAABAE' }} />
                  Option 1
                </MenuItem>
                <MenuItem>
                  <SupportAgentIcon sx={{ fontSize: 16, color: '#AAABAE' }} />
                  Option 2
                </MenuItem>
              </Menu>
            </>
            </Stack>
          )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <IconButton color="primary" onClick={toggleChat}>
                  <SmsIcon />
                </IconButton>

                {/* Drawer ou panneau à droite */}
                <Drawer anchor="right" open={openChat} onClose={toggleChat}>
                  <Box sx={{ width: 400, p: 2 }}>
                  <IconButton
                    onClick={toggleChat}
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                    <GroupChat />
                  </Box>
                </Drawer>
              </Box>

          {/* Droite : Menu utilisateur */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center',marginRight: isMobile ? '10px' : '50px',  }}>
              <Chip
                avatar={<Avatar alt={user.username} src={avatarSrc} />}
                label={user.username}
                color="primary"
                onClick={handleMenuClick}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 2 }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <AccountCircle sx={{ marginRight: 1 }} /> Profil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ marginRight: 1 }} /> Déconnexion
                </MenuItem>
              </Menu>
            </Box>
          )}


          {!user && !isMobile && (
            <Button color="danger" variant="soft" sx={{ marginRight: 1 }} onClick={() => window.location.href = '/login' }>
              Se connecter
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Navbar;