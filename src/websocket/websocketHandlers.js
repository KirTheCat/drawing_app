import { sendMessage, on, off, connectSocket, isSocketConnected } from './WebSocket';

export const connectToRoom = (action, userName, roomName, roomId, setIsConnected, setDrawingData, setMessages, setCurrentRoomName, setHostName, navigate) => {
    let isSubscribed = true;

    const handleRoomCreated = (data) => {
        if (isSubscribed) {
            setMessages(prevMessages => [...prevMessages, 'Комната создана']);
            setCurrentRoomName(roomName);
            setHostName(userName);
            navigate(`/room/${data.roomId}`, { state: { userName, roomName, action: 'create' } }, { replace: true });
        }
    };

    const handleJoinRoom = (data) => {
        if (isSubscribed) {
            if (data.status === 'error') {
                alert(data.message);
            } else if (data.status === 'success') {
                const validData = data.drawingData.map(d => JSON.parse(d));
                setDrawingData(validData);
                setMessages(prevMessages => [...prevMessages, `${data.userName || 'Неизвестный пользователь'} подключился к комнате.`]);
            }
        }
    };

    const handleDraw = (data) => {
        if (isSubscribed) {
            const drawing = JSON.parse(data.drawingData);
            if (drawing && drawing.points) {
                setDrawingData(prevData => [...prevData, drawing]);
            }
        }
    };

    const handleSyncDrawingData = (data) => {
        if (isSubscribed) {
            const validData = JSON.parse(data.drawingData);
            setDrawingData(validData);
        }
    };

    const handleUserLeft = (data) => {
        if (isSubscribed) {
            setMessages(prevMessages => [...prevMessages, `${data.userName || 'Неизвестный пользователь'} покинул комнату.`]);
        }
    };

    const handleUserJoined = (data) => {
        setMessages(prevMessages => [...prevMessages, `${data.userName} подключился к комнате.`]);
    };

    on('userJoined', handleUserJoined);
    on('syncDrawingData', handleSyncDrawingData);
    on('roomCreated', handleRoomCreated);
    on('joinRoom', handleJoinRoom);
    on('draw', handleDraw);
    on('userLeft', handleUserLeft);

    if (!isSocketConnected()) {
        connectSocket(
            'ws://localhost:8080/drawing',
            () => {
                setIsConnected(true);
                if (action === 'create') {
                    sendMessage({ type: 'createRoom', userName, roomName });
                } else if (action === 'join') {
                    sendMessage({ type: 'joinRoom', roomId, userName });
                }
            },
            null,
            () => {
                setIsConnected(false);
                off('userJoined', handleUserJoined);
                off('syncDrawingData', handleSyncDrawingData);
                off('roomCreated', handleRoomCreated);
                off('joinRoom', handleJoinRoom);
                off('draw', handleDraw);
                off('userLeft', handleUserLeft);
                isSubscribed = false;
            }
        );
    } else {
        if (action === 'create') {
            sendMessage({ type: 'createRoom', userName, roomName });
        } else if (action === 'join') {
            sendMessage({ type: 'joinRoom', roomId, userName });
        }
    }

    // Очистка подписок при демонтировании компонента
    return () => {
        isSubscribed = false;
        off('userJoined', handleUserJoined);
        off('syncDrawingData', handleSyncDrawingData);
        off('roomCreated', handleRoomCreated);
        off('joinRoom', handleJoinRoom);
        off('draw', handleDraw);
        off('userLeft', handleUserLeft);
    };
};
