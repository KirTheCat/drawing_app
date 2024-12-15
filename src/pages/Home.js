import Form from "../components/Form";
import {Box} from "@mui/material";
import {useState} from "react";
import {createRoom, joinRoom} from "../websocket/websocketHandlers";
import {useNavigate} from "react-router-dom";

function Home() {
    const [userName, setUserName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isCreatingRoom, setIsCreatingRoom] = useState(true);
    const [drawingData, setDrawingData] = useState([]);
    const [currentRoomName, setCurrentRoomName] = useState('');
    const [hostName, setHostName] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = () => createRoom(userName, roomName, navigate, setDrawingData, setCurrentRoomName, setHostName, drawingData);
    const handleJoinRoom = () => {
        if (roomId && roomId.trim() !== '') {
            joinRoom(userName, roomName, roomId, navigate, setDrawingData, setCurrentRoomName, setHostName);
        } else {
            alert('Введите корректный ID комнаты');
        }
    };


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            p: 2,
            borderRadius: 2,
            mt: 4,
            margin: '0 auto'
        }}>
            <Form
                isCreatingRoom={isCreatingRoom}
                setIsCreatingRoom={setIsCreatingRoom}
                userName={userName}
                setUserName={setUserName}
                roomName={roomName}
                setRoomName={setRoomName}
                roomId={roomId}
                setRoomId={setRoomId}
                handleAction={isCreatingRoom ? handleCreateRoom : handleJoinRoom}
            />
        </Box>
    );
}

export default Home;