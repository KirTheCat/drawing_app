import React from 'react';
import { Box } from '@mui/material';

const Messages = ({ messages }) => {
    return (
        <Box sx={{
            bgcolor: '#fff',
            p: 2,
            borderRadius: '8px',
            boxShadow: 1,
            mt: 2,
            overflowY: 'auto',
            maxHeight: '200px',
        }}>
            {messages.map((msg, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                    {msg}
                </Box>
            ))}
        </Box>
    );
};

export default Messages;
