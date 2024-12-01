import React from 'react';
import { Box, Typography } from '@mui/material';

function RoomInfoComponent({ userName, roomId, currentRoomName }) {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Комната: {currentRoomName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Идентификатор: {roomId}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Хост: {userName}
            </Typography>
        </Box>
    );
}

export default RoomInfoComponent;
