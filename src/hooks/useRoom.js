import {useEffect, useRef, useState} from 'react';
import {useLocation, useParams, useNavigate} from 'react-router-dom';
import useDrawing from '../hooks/useDrawing';
import {createRoom, joinRoom} from '../websocket/websocketHandlers';
import {sendMessage} from "../websocket/WebSocket";

function useRoom() {
    const {roomId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {userName, roomName, action} = location.state;

    const [color, setColor] = useState('#000000');
    const [brushRadius, setBrushRadius] = useState(5);
    const [eraserActive, setEraserActive] = useState(false);
    const [drawingData, setDrawingData] = useState([]);
    const [currentRoomName, setCurrentRoomName] = useState(roomName);
    const [isConnected, setIsConnected] = useState(false);
    const [hostName, setHostName] = useState('');
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
            ? createRoom(userName, roomName, navigate, setDrawingData, setCurrentRoomName, setHostName, drawingData)
            : joinRoom(userName, roomName, roomId, navigate, setDrawingData, setCurrentRoomName, setHostName, drawingData);

        return () => {
            if (typeof disconnect === 'function') {
                disconnect();
            }
        };
    }, [action, userName, roomName, roomId, setIsConnected, setDrawingData, setCurrentRoomName, setHostName, navigate, drawingData]);

    const handleLeaveRoom = () => {
        if (isConnected) {
            sendMessage({type: 'leaveRoom', roomId, userName});
            navigate('/');
        }
    };

    return {
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
        handleMouseUp,
        handleMouseMove,
        handleMouseDown,
        isConnected,
        stageRef
    };
}

export default useRoom;
