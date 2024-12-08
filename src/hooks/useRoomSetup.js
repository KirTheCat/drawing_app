// useRoomSetup.js
import {useLocation, useParams, useNavigate} from 'react-router-dom';
import {useState, useRef} from 'react';

const useRoomSetup = () => {
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
    const [messages, setMessages] = useState([]);
    const stageRef = useRef(null);

    return {
        roomId,
        location,
        navigate,
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
        messages,
        setMessages,
        stageRef
    };
};

export default useRoomSetup;
