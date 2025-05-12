// components/GroupChat.jsx
import { useEffect, useState } from 'react';
import { fetchMessages, sendMessage } from '../api/chat';
import { Box, Textarea, Button, Typography } from '@mui/joy';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Divider from '@mui/joy/Divider';
import { formatDistanceToNow } from 'date-fns';
import API_URL from '../api/users'; 
import Chip from '@mui/joy/Chip';
import SendIcon from '@mui/icons-material/Send';
import Input from '@mui/joy/Input';

export default function GroupChat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  const loadMessages = async () => {
    const data = await fetchMessages();
    setMessages(data);
  };

  const handleSend = async () => {
    if (!content.trim()) return;
    await sendMessage(content);
    setContent('');
    loadMessages();
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // actualisation auto
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography level="h4" mb={2}>Chat de Groupe</Typography>
      <List sx={{ height: '100%', overflowY: 'auto', mb: 2 }}>
        {messages.map((msg) => (
            <>
            <Divider  />
            <ListItem key={msg.id} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar src={`${API_URL}${msg.user.avatar}`} alt={msg.user.username} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Chip variant="soft" color="neutral" size="sm" sx={{ fontWeight: 'bold' }}>
                      {msg.user.username}
                    </Chip>
   
                }
                secondary={
                <>
                    <Typography variant="body2" component="span" color="text.primary">
                    {msg.content}
                    </Typography>
                    <Typography level="body-xs" component="div" color="text.secondary">
                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </Typography>
                </>
                }
            />
            </ListItem>
            </>
        ))}
        </List>

        <Textarea 
          onChange={(e) => setContent(e.target.value)}
          minRows={2}
          placeholder="Écris un message..."
          sx={{ mb: 1 }}
          value={content}
          endDecorator={<Button onClick={handleSend}><SendIcon/></Button>}
        ></Textarea>
    </Box>
  );
}
