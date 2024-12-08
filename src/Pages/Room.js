import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ToolsMenu from '../DrawComponents/ToolsMenu';
import DrawingBoard from '../DrawComponents/DrawingBoard';
import { connectToRoom } from '../websocket/websocketHandlers';
import { sendMessage } from '../websocket/WebSocket';
import RoomInfo from '../DrawComponents/RoomInfoComponent';
import Messages from '../DrawComponents/Messages';
import LeaveButton from '../DrawComponents/LeaveButton';

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
    const [hostName, setHostName] = useState('');
    const [messages, setMessages] = useState([]);
    const stageRef = useRef(null);

    useEffect(() => {
        const disconnect = connectToRoom(action, userName, roomName, roomId, setIsConnected, setDrawingData, setMessages, setCurrentRoomName, setHostName, navigate);
        return () => {
            disconnect();
        };
    }, [action, roomId, userName, roomName, navigate]);

    const handleDrawSave = (lastLine) => {
        if (isConnected) {
            sendMessage({ type: 'draw', roomId, drawingData: JSON.stringify(lastLine) });
        }
    };

    const handleLeaveRoom = () => {
        if (isConnected) {
            sendMessage({ type: 'leaveRoom', roomId, userName });
            navigate('/');  // Переход на главную страницу или другую страницу по вашему выбору
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', bgcolor: '#f5f5f5' }}>
            <Box sx={{
                width: '25%',
                maxWidth: '25%',
                textAlign: 'left',
                bgcolor: '#e0e0e0',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                height: '100vh'
            }}>
                <RoomInfo userName={userName} roomId={roomId} currentRoomName={currentRoomName} hostName={hostName} />
                <ToolsMenu color={color} setColor={setColor} brushRadius={brushRadius} setBrushRadius={setBrushRadius}
                           eraserActive={eraserActive} setEraserActive={setEraserActive} />
                <LeaveButton handleLeaveRoom={handleLeaveRoom} />
                <Messages messages={messages} />
            </Box>
            <DrawingBoard ref={stageRef} color={color} brushRadius={brushRadius} eraserActive={eraserActive}
                          drawingData={drawingData} onDraw={handleDrawSave} isConnected={isConnected}
                          roomId={roomId} />
        </Box>
    );
}

export default Room;
