//room.js
import React, {forwardRef} from 'react';
import {Box} from '@mui/material';
import RoomInfo from '../components/RoomInfoComponent';
import ToolsMenu from '../components/ToolsMenu';
import DrawingBoard from '../components/DrawingBoard';
import LeaveButton from '../components/LeaveButton';
import useRoom from '../hooks/useRoom';
import {useSelector} from "react-redux";

const Room = forwardRef((props, ref) => {
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
        fillActive,
        setFillActive,
        isConnected,
        stageRef,
        handleLeaveRoom,
    } = useRoom();

    const drawingData = useSelector((state) => state.drawing.drawingData);


    return (
        <Box sx={{display: 'flex', height: '100vh'}} ref={ref}>
            <Box
                sx={{
                    width: '200px',
                    height: '100%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src="/img/logo.jpg" alt="ArtCollab Logo" style={{maxWidth: '100%', maxHeight: '100%'}}/>
                </Box>
                <Box sx={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <RoomInfo userName={userName} roomId={roomId} currentRoomName={currentRoomName}
                              hostName={hostName}/>
                    <ToolsMenu
                        color={color}
                        setColor={setColor}
                        brushRadius={brushRadius}
                        setBrushRadius={setBrushRadius}
                        eraserActive={eraserActive}
                        setEraserActive={setEraserActive}
                        fillActive={fillActive}
                        setFillActive={setFillActive}
                    />
                    <LeaveButton handleLeaveRoom={handleLeaveRoom}/>
                </Box>
            </Box>
            <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'}}>
                <DrawingBoard
                    ref={stageRef}
                    color={color}
                    brushRadius={brushRadius}
                    eraserActive={eraserActive}
                    fillActive={fillActive}
                    drawingData={drawingData}
                    isConnected={isConnected}
                    roomId={roomId}
                    sx={{
                        width: '100%',
                        height: '100%',
                        border: '10px solid #333',
                        borderRadius: 2,
                        backgroundColor: '#FCFDFE'
                    }}
                />
            </Box>
        </Box>
    );
});
export default Room;