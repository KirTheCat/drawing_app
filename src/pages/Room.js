import React, {useEffect} from 'react';
import {Box} from '@mui/material';
import ToolsMenu from '../components/ToolsMenu';
import DrawingBoard from '../components/DrawingBoard';
import {connectToRoom} from '../websocket/websocketHandlers';
import {sendMessage} from '../websocket/WebSocket';
import RoomInfo from '../components/RoomInfoComponent';
import LeaveButton from '../components/LeaveButton';
import useRoomSetup from '../hooks/useRoomSetup';

function Room() {
    const {
        roomId,
        userName,
        roomName,
        action,
        color,
        setColor,
        brushRadius,
        setBrushRadius,
        eraserActive,
        setEraserActive,
        drawingData,
        setDrawingData,
        currentRoomName,
        setCurrentRoomName,
        isConnected,
        setIsConnected,
        hostName,
        setHostName,
        stageRef,
        navigate
    } = useRoomSetup();

    useEffect(() => {
        const disconnect = connectToRoom(action, userName, roomName, roomId, setIsConnected, setDrawingData, setCurrentRoomName, setHostName, navigate, drawingData);
        return () => {
            disconnect();
        };
    }, [action, userName, roomName, roomId, setIsConnected, setDrawingData, setCurrentRoomName, setHostName, navigate, drawingData]); // Добавление всех зависимостей

    const handleDrawSave = (lastLine) => {
        if (isConnected) {
            sendMessage({type: 'draw', roomId, drawingData: JSON.stringify(lastLine)});
        }
    };

    const handleLeaveRoom = () => {
        if (isConnected) {
            sendMessage({type: 'leaveRoom', roomId, userName});
            navigate('/');
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
            </Box>
            <DrawingBoard ref={stageRef} color={color} brushRadius={brushRadius} eraserActive={eraserActive}
                          drawingData={drawingData} onDraw={handleDrawSave} isConnected={isConnected}
                          roomId={roomId} />
        </Box>
    );
}

export default Room;