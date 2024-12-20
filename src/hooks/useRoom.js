// useRoom.js
import {useEffect, useRef} from 'react';
import {useLocation, useParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
    setColor,
    setBrushRadius,
    setEraserActive,
    setCurrentRoomName,
    setHostName
} from '../redux/slicers/drawingSlice';
import useDrawing from '../hooks/useDrawing';
import {createRoom, joinRoom} from '../websocket/websocketHandlers';
import {closeSocket, sendMessage} from "../websocket/WebSocket";

function useRoom() {
    const {roomId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {userName, roomName, action} = location.state;

    const dispatch = useDispatch();
    const color = useSelector((state) => state.drawing.color);
    const brushRadius = useSelector((state) => state.drawing.brushRadius);
    const eraserActive = useSelector((state) => state.drawing.eraserActive);
    const drawingData = useSelector((state) => state.drawing.drawingData);
    const currentRoomName = useSelector((state) => state.drawing.currentRoomName);
    const hostName = useSelector((state) => state.drawing.hostName);
    const isConnected = useSelector((state) => state.drawing.isConnected);
    const stageRef = useRef(null);

    const {handleMouseDown, handleMouseMove, handleMouseUp} = useDrawing({
        color,
        brushRadius,
        eraserActive,
        onDraw: (lastLine) => {
            if (isConnected) {
                console.log('Отправка данных рисования', {lastLine});
                sendMessage({type: 'draw', roomId, drawingData: JSON.stringify(lastLine)});
            }
        },
        isConnected,
        roomId,
        drawingData,
        userName
    });

    useEffect(() => {
        console.log('Подключение к комнате', {action, userName, roomName, roomId});
        const disconnect = action === 'create'
            ? createRoom(userName, roomName, navigate, (name) => dispatch(setCurrentRoomName(name)), (name) => dispatch(setHostName(name)))
            : joinRoom(userName, roomName, roomId, navigate, (name) => dispatch(setCurrentRoomName(name)), (name) => dispatch(setHostName(name)));

        return () => {
            if (typeof disconnect === 'function') {
                disconnect();
            }
        };
    }, [action, userName, roomName, roomId, navigate, dispatch]);
    const handleLeaveRoom = () => {
        if (isConnected) {
            sendMessage({type: 'leaveRoom', roomId, userName});
            navigate('/');
            closeSocket();
        }
    };

    return {
        userName,
        roomId,
        currentRoomName,
        hostName,
        color,
        setColor: (color) => dispatch(setColor(color)),
        brushRadius,
        setBrushRadius: (radius) => dispatch(setBrushRadius(radius)),
        eraserActive,
        setEraserActive: (active) => dispatch(setEraserActive(active)),
        drawingData,
        handleLeaveRoom,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        isConnected,
        stageRef
    };
}

export default useRoom;
