import React from 'react';
import { Button } from '@mui/material';

const LeaveButton = ({ handleLeaveRoom }) => {
    return (
        <Button variant="contained" color="secondary" onClick={handleLeaveRoom} sx={{ mt: 2 }}>
            Выйти из комнаты
        </Button>
    );
};

export default LeaveButton;
