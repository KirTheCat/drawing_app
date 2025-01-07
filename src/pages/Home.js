import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Form from '../components/Form';
import AnimatedBackground from '../components/AnimatedBackground';
import {createRoom, joinRoom} from '../websocket/websocketHandlers';
import {setRoomName, setUserName} from "../redux/slicers/roomSlice";

function Home() {
    const userName = useSelector(state => state.room.userName);
    const roomName = useSelector(state => state.room.roomName);
    const [roomId, setRoomId] = useState('');
    const [isCreatingRoom, setIsCreatingRoom] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        createRoom(userName, roomName, navigate, dispatch);
    };

    const handleJoinRoom = () => {
        if (roomId && roomId.trim() !== '') {
            joinRoom(userName, roomName, roomId, navigate, dispatch);
        } else {
            alert('Введите корректный ID комнаты');
        }
    };

    const handleUserNameChange = (event) => {
        dispatch(setUserName(event.target.value));
    };

    const handleRoomNameChange = (event) => {
        dispatch(setRoomName(event.target.value));
    };

    return (
        <AnimatedBackground>
            <Form
                isCreatingRoom={isCreatingRoom}
                setIsCreatingRoom={setIsCreatingRoom}
                userName={userName}
                setUserName={handleUserNameChange}
                roomName={roomName}
                setRoomName={handleRoomNameChange}
                roomId={roomId}
                setRoomId={setRoomId}
                handleAction={isCreatingRoom ? handleCreateRoom : handleJoinRoom}
            />
        </AnimatedBackground>
    );
}

export default Home;