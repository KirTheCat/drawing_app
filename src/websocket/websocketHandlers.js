import {sendMessage, on, off, connectSocket, isSocketConnected} from './WebSocket';

let isConnecting = false;

export const syncDrawingData = (roomId, drawingData, userName) => {
    sendMessage({
        type: 'syncDrawingData',
        roomId,
        drawingData: JSON.stringify(drawingData),
        hostName: userName
    });
};

// Общие события
// Общие события
const commonEvents = {
    requestDrawingData: (userName, drawingData) => (data) => {
        console.log('Запрос данных рисования', {receivedData: data});

        if (data.userName !== userName) {
            syncDrawingData(data.roomId, drawingData, userName);
        }
    },

    syncDrawingData: (setDrawingData) => (data) => {
        console.log('Синхронизация данных рисования', {receivedData: data});
        const drawings = JSON.parse(data.drawingData);
        setDrawingData(prevData => [...prevData, ...drawings]);
    },

    broadcastDrawingData: (setDrawingData) => (data) => {
        console.log('Трансляция данных рисования', {receivedData: data});

        const drawing = JSON.parse(data.drawingData);
        if (drawing?.points) {
            setDrawingData(prevData => [...prevData, drawing]);
        }
    },

    draw: (setDrawingData, roomId, userName) => (data) => {
        console.log('Получение данных рисования', {receivedData: data});

        const drawing = JSON.parse(data.drawingData);
        if (drawing?.points) {
            setDrawingData(prevData => {
                const updatedData = [...prevData, drawing];
                syncDrawingData(roomId, updatedData, userName); // исправлено
                return updatedData;
            });
            // Трансляция данных рисования другим пользователям
            sendMessage({type: 'broadcastDrawingData', roomId, drawingData: JSON.stringify(drawing)});
        }
    }
};

// Событие создания комнаты
const createRoomEvent = (roomName, userName, navigate, setCurrentRoomName, setHostName) => (data) => {
    console.log('Создание комнаты', {receivedData: data});

    if (data.status === 'success') {
        setCurrentRoomName(roomName);
        setHostName(userName);
        isConnecting = false;
        navigate(`/room/${data.roomId}`, {
            state: {userName, roomName, action: 'create', hostName: userName}
        }, {replace: true});
    } else {
        alert(data.message);
        isConnecting = false;
    }
};

// Событие подключения к комнате
const joinRoomEvent = (roomName, userName, roomId, setDrawingData, setCurrentRoomName, setHostName, navigate) => (data) => {
    console.log('Подключение к комнате', {receivedData: data});

    if (data.status === 'success') {
        const drawings = data.drawingData.map(d => JSON.parse(d));
        setDrawingData(drawings);
        console.log('Текущие данные рисования установлены', drawings);
        setCurrentRoomName(roomName);
        setHostName(data.hostName);
        isConnecting = false;
        sendMessage({type: 'requestDrawingData', roomId, userName});

        // Навигация на страницу комнаты
        navigate(`/room/${roomId}`, {
            state: {userName, roomName, action: 'join', hostName: data.hostName}
        }, {replace: true});
    } else {
        alert(data.message);
        isConnecting = false;
    }
};

// Подписка на события
const subscribeToEvents = (events) => {
    Object.entries(events).forEach(([event, handler]) => {
        console.log(`Подписка на событие: ${event}`);
        on(event, handler);
    });
};

// Отписка от событий
const unsubscribeFromEvents = (events) => {
    Object.entries(events).forEach(([event, handler]) => {
        console.log(`Отписка от события: ${event}`);
        off(event, handler);
    });
};

// Создание комнаты
export const createRoom = (userName, roomName, navigate, setDrawingData, setCurrentRoomName, setHostName, drawingData) => {
    if (isConnecting || isSocketConnected()) return;
    isConnecting = true;

    const events = {
        requestDrawingData: commonEvents.requestDrawingData(userName, drawingData),
        syncDrawingData: commonEvents.syncDrawingData(setDrawingData),
        broadcastDrawingData: commonEvents.broadcastDrawingData(setDrawingData),
        draw: commonEvents.draw(setDrawingData, roomName, userName),
        roomCreated: createRoomEvent(roomName, userName, navigate, setCurrentRoomName, setHostName)
    };

    subscribeToEvents(events);

    connectSocket(
        'ws://localhost:8080/drawing',
        () => {
            console.log('Отправка сообщения о создании комнаты');
            sendMessage({type: 'createRoom', userName, roomName, drawingData: []});
        },
        null,
        () => {
            unsubscribeFromEvents(events);
            isConnecting = false;
        }
    );

    return () => unsubscribeFromEvents(events);
};

export const joinRoom = (userName, roomName, roomId, navigate, setDrawingData, setCurrentRoomName, setHostName, drawingData) => {
    if (isConnecting || isSocketConnected()) return;
    isConnecting = true;

    const events = {
        requestDrawingData: commonEvents.requestDrawingData(userName, drawingData),
        syncDrawingData: commonEvents.syncDrawingData(setDrawingData),
        broadcastDrawingData: commonEvents.broadcastDrawingData(setDrawingData),
        draw: commonEvents.draw(setDrawingData, roomId, userName),
        joinRoom: joinRoomEvent(roomName, userName, roomId, setDrawingData, setCurrentRoomName, setHostName, navigate)
    };

    subscribeToEvents(events);

    connectSocket(
        'ws://localhost:8080/drawing',
        () => {
            console.log('Отправка сообщения о подключении к комнате');
            sendMessage({type: 'joinRoom', userName, roomId});
        },
        null,
        () => {
            unsubscribeFromEvents(events);
            isConnecting = false;
        }
    );

    return () => unsubscribeFromEvents(events);
};
