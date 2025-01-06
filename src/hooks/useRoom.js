//useRoom.js
import {useEffect, useRef, useState} from 'react';
import {useLocation, useParams, useNavigate} from 'react-router-dom';
import useDrawing from '../hooks/useDrawing';
import {createRoom, joinRoom} from '../websocket/websocketHandlers';
import {sendMessage} from "../websocket/WebSocket";

function useRoom() {
    const {roomId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {userName, action} = location.state;

    const [roomName, setRoomName] = useState(''); // Инициализируем null
    const [hostName, setHostName] = useState(''); // Инициализируем null

    const [color, setColor] = useState('#000000');
    const [brushRadius, setBrushRadius] = useState(5);
    const [eraserActive, setEraserActive] = useState(false);
    const [drawingData, setDrawingData] = useState([]);
    const [currentRoomName, setCurrentRoomName] = useState(roomName);
    const [isConnected, setIsConnected] = useState(false);
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

        const handleRoomData = (data) => { // Функция для установки данных комнаты
            setRoomName(data.roomName);
            setHostName(data.hostName);
        };

        console.log('Подключение к комнате', {action, userName, roomName, roomId});
        const disconnect = action === 'create'
            ? createRoom(userName, navigate, handleRoomData, drawingData)
            : joinRoom(userName, roomId, navigate, handleRoomData, drawingData);

        return () => {
            if (typeof disconnect === 'function') {
                disconnect();
            }
        };
    }, [action, userName, roomId, navigate, drawingData]);

    const handleLeaveRoom = () => {
        if (isConnected) {
            sendMessage({type: 'leaveRoom', roomId, userName});
            navigate('/');
        }
    };

    return {
        userName,
        roomId,
        currentRoomName: roomName,
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