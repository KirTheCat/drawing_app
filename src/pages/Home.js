//Home.js
import Form from "../components/Form";
import {useState} from "react";
import {createRoom, joinRoom} from "../websocket/websocketHandlers";
import {useNavigate} from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

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
        <AnimatedBackground>
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
        </AnimatedBackground>
    );
}

export default Home;