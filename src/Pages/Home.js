import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Switch, FormControlLabel } from '@mui/material';
import { connectSocket, sendMessage, isSocketConnected } from '../websocket/WebSocket';

function Home() {
    const [userName, setUserName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isCreatingRoom, setIsCreatingRoom] = useState(true);
    const navigate = useNavigate();

    const createRoom = () => {
        if (!isSocketConnected()) {
            connectSocket(
                'ws://localhost:8080/drawing',
                () => {
                    sendMessage({ type: 'createRoom', userName, roomName });
                },
                (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'roomCreated' && data.status === 'success') {
                        navigate(`/room/${data.roomId}`, { state: { userName, roomName, action: 'create' } });
                    } else {
                        alert(data.message);
                    }
                },
                () => {}
            );
        } else {
            sendMessage({ type: 'createRoom', userName, roomName });
        }
    };

    const joinRoom = () => {
        navigate(`/room/${roomId}`, { state: { userName, action: 'join' } });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mt: 4, margin: '0 auto' }}>
            <Box sx={{ width: '25%', textAlign: 'center' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={!isCreatingRoom}
                            onChange={() => setIsCreatingRoom(!isCreatingRoom)}
                            name="roomSwitch"
                            color="primary"
                        />
                    }
                    label={isCreatingRoom ? "Создать комнату" : "Подключиться к комнате"}
                />
                {isCreatingRoom ? (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Создать комнату
                        </Typography>
                        <TextField
                            label="Введите ваше имя"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Введите название комнаты"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={createRoom} fullWidth sx={{ mt: 2 }}>
                            Создать комнату
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Подключиться к комнате
                        </Typography>
                        <TextField
                            label="Введите ваше имя"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Введите ID комнаты"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={joinRoom} fullWidth sx={{ mt: 2 }}>
                            Подключиться к комнате
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Home;
