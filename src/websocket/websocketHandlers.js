import {sendMessage, on, off, connectSocket, isSocketConnected} from './WebSocket';

const subscribeToEvents = (events) => {
    Object.entries(events).forEach(([event, handler]) => on(event, handler));
};

const unsubscribeFromEvents = (events) => {
    Object.entries(events).forEach(([event, handler]) => off(event, handler));
};

export const connectToRoom = (action, userName, roomName, roomId, setIsConnected, setDrawingData,
                              setCurrentRoomName, setHostName, navigate, drawingData) => {
    let isSubscribed = true;

    const events = {
        requestDrawingData: (data) => {
            if (data.userName !== userName && isSubscribed) {
                sendMessage({
                    type: 'syncDrawingData',
                    roomId,
                    drawingData: JSON.stringify(drawingData),
                    hostName: userName
                });
            }
        },
        syncDrawingData: (data) => {
            if (isSubscribed) {
                setDrawingData(prevData => [...prevData, ...JSON.parse(data.drawingData)]);
                if (data.hostName) {
                    setHostName(data.hostName);
                }
            }
        },
        roomCreated: (data) => {
            if (isSubscribed) {
                setCurrentRoomName(roomName);
                setHostName(userName);
                navigate(`/room/${data.roomId}`, {
                    state: {
                        userName,
                        roomName,
                        action: 'create',
                        hostName: userName
                    }
                }, {replace: true});
            }
        },
        broadcastDrawingData: (data) => {
            if (isSubscribed) {
                const drawing = JSON.parse(data.drawingData);
                if (drawing?.points) {
                    setDrawingData(prevData => [...prevData, drawing]);
                }
            }
        },
        joinRoom: (data) => {
            if (isSubscribed) {
                if (data.status === 'error') {
                    alert(data.message);
                } else if (data.status === 'success') {
                    setDrawingData(data.drawingData.map(d => JSON.parse(d)));
                    setCurrentRoomName(roomName);
                    setHostName(data.hostName);
                    sendMessage({type: 'requestDrawingData', roomId, userName});
                }
            }
        },
        draw: (data) => {
            if (isSubscribed) {
                const drawing = JSON.parse(data.drawingData);
                if (drawing?.points) {
                    setDrawingData(prevData => [...prevData, drawing]);
                }
            }
        },
    };

    subscribeToEvents(events);

    if (!isSocketConnected()) {
        connectSocket(
            'ws://localhost:8080/drawing',
            () => {
                setIsConnected(true);
                sendMessage({type: action === 'create' ? 'createRoom' : 'joinRoom', userName, roomName, roomId});
            },
            null,
            () => {
                setIsConnected(false);
                unsubscribeFromEvents(events);
                isSubscribed = false;
            }
        );
    } else {
        sendMessage({type: action === 'create' ? 'createRoom' : 'joinRoom', userName, roomName, roomId});
    }

    return () => {
        isSubscribed = false;
        unsubscribeFromEvents(events);
    };
};
