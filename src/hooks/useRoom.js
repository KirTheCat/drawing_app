import {useEffect} from 'react';
import {useLocation, useParams, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {createRoom, joinRoom} from '../websocket/websocketHandlers';
import {sendMessage} from "../websocket/WebSocket";
import {
    setColor,
    setBrushRadius,
    setEraserActive,
} from '../redux/slicers/drawingSlice';
import {
    setHostName,
    setRoomId,
    setUserName,
    setIsConnected
} from '../redux/slicers/roomSlice'

function useRoom() {
    const dispatch = useDispatch();
    const {roomId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {userName, action} = location.state;

    const color = useSelector((state) => state.drawing.color);
    const brushRadius = useSelector((state) => state.drawing.brushRadius);
    const eraserActive = useSelector((state) => state.drawing.eraserActive);
    const drawingData = useSelector((state) => state.drawing.drawingData);

    const roomName = useSelector((state) => state.room.roomName);
    const hostName = useSelector((state) => state.room.hostName);
    const isConnected = useSelector((state) => state.room.isConnected);

    useEffect(() => {
        dispatch(setUserName(userName));
        dispatch(setRoomId(roomId));
    }, [dispatch, roomId, userName])

    useEffect(() => {
        const handleRoomData = (data) => {
            dispatch(setHostName(data.hostName));
            dispatch(setIsConnected(true))
        };

        const disconnect = action === 'create'
            ? createRoom(userName, roomId, navigate, handleRoomData, drawingData)
            : joinRoom(userName, roomName, roomId, navigate, handleRoomData, drawingData);

        return () => {
            if (typeof disconnect === 'function') {
                disconnect();
            }
        };
    }, [dispatch, roomName, action, userName, roomId, navigate, drawingData]);

    const handleLeaveRoom = () => {

        dispatch(setIsConnected(false));
        navigate('/', {replace: true});
    };

    return {
        userName,
        roomId,
        roomName,
        hostName,
        color,
        setColor: (c) => dispatch(setColor(c)),
        brushRadius,
        setBrushRadius: (r) => dispatch(setBrushRadius(r)),
        eraserActive,
        setEraserActive: (e) => dispatch(setEraserActive(e)),
        drawingData,
        navigate,
        handleLeaveRoom,
        isConnected,
    };
}

export default useRoom;