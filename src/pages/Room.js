import React from 'react';
import {Box} from '@mui/material';
import RoomInfo from '../components/RoomInfoComponent';
import ToolsMenu from '../components/ToolsMenu';
import DrawingBoard from '../components/DrawingBoard';
import LeaveButton from '../components/LeaveButton';
import useRoom from '../hooks/useRoom';

function Room() {
    const {
        userName,
        roomId,
        currentRoomName,
        hostName,
        color,
        setColor,
        brushRadius,
        setBrushRadius,
        eraserActive,
        setEraserActive,
        drawingData,
        handleLeaveRoom,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        isConnected,
        stageRef
    } = useRoom();

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', bgcolor: '#f5f5f5'}}>
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
                <RoomInfo userName={userName} roomId={roomId} currentRoomName={currentRoomName} hostName={hostName}/>
                <ToolsMenu
                    color={color}
                    setColor={setColor}
                    brushRadius={brushRadius}
                    setBrushRadius={setBrushRadius}
                    eraserActive={eraserActive}
                    setEraserActive={setEraserActive}
                />
                <LeaveButton handleLeaveRoom={handleLeaveRoom}/>
            </Box>
            <DrawingBoard
                ref={stageRef}
                color={color}
                brushRadius={brushRadius}
                eraserActive={eraserActive}
                drawingData={drawingData}
                onDraw={handleMouseUp}
                isConnected={isConnected}
                roomId={roomId}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
            />
        </Box>
    );
}

export default Room;
