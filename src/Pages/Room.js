import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ToolsMenu from '../DrawComponents/ToolsMenu';
import DrawingBoard from '../DrawComponents/DrawingBoard';
import { connectSocket, sendMessage, closeSocket, on, off } from '../websocket/WebSocket';
import RoomInfo from '../DrawComponents/RoomInfoComponent';

function Room() {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, roomName, action } = location.state;

    const [color, setColor] = useState('#000000');
    const [brushRadius, setBrushRadius] = useState(5);
    const [eraserActive, setEraserActive] = useState(false);
    const [drawingData, setDrawingData] = useState([]);
    const [currentRoomName, setCurrentRoomName] = useState(roomName);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const handleRoomCreated = (data) => {
            setCurrentRoomName(roomName);
            navigate(`/room/${data.roomId}`, { state: { userName, roomName, action: 'create' } }, { replace: true });
        };

        const handleJoinRoom = (data) => {
            if (data.status === 'error') {
                alert(data.message);
            } else if (data.status === 'success') {
                setDrawingData(data.drawingData);
                setCurrentRoomName(data.roomName);
            }
        };

        const handleDraw = (data) => {
            setDrawingData((prevData) => [...prevData, data.drawingData]);
        };

        // Подписка на события WebSocket
        on('roomCreated', handleRoomCreated);
        on('joinRoom', handleJoinRoom);
        on('draw', handleDraw);

        // Подключение к WebSocket
        connectSocket(
            'ws://localhost:8080/drawing',
            () => {
                setIsConnected(true);
                if (action === 'create') {
                    sendMessage({ type: 'createRoom', userName, roomName });
                } else if (action === 'join') {
                    sendMessage({ type: 'joinRoom', roomId, userName });
                }
            },
            null,
            () => {
                setIsConnected(false);
                off('roomCreated', handleRoomCreated);
                off('joinRoom', handleJoinRoom);
                off('draw', handleDraw);
            }
        );

        return () => {
            closeSocket();
        };
    }, [action, roomId, userName, roomName, navigate]);

    const handleDrawSave = (saveData) => {
        if (isConnected) {
            sendMessage({ type: 'draw', roomId, drawingData: saveData });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', bgcolor: '#f5f5f5' }}>
            <Box sx={{ width: '25%', maxWidth: '25%', textAlign: 'left', bgcolor: '#e0e0e0', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100vh' }}>
                <RoomInfo userName={userName} roomId={roomId} currentRoomName={currentRoomName} />
                <ToolsMenu color={color} setColor={setColor} brushRadius={brushRadius} setBrushRadius={setBrushRadius} eraserActive={eraserActive} setEraserActive={setEraserActive} />
            </Box>
            <DrawingBoard color={color} brushRadius={brushRadius} eraserActive={eraserActive} drawingData={drawingData} onDraw={handleDrawSave} />
        </Box>
    );
}

export default Room;
