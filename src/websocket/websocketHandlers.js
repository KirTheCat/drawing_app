import {sendMessage, on, off, connectSocket, isSocketConnected} from './WebSocket';
import {setDrawingData} from '../redux/slicers/drawingSlice';
import store from '../redux/store';
import {setHostName, setRoomName} from "../redux/slicers/roomSlice";

let isConnecting = false;

export const syncDrawingData = (roomId, drawingData, userName) => {
    sendMessage({
        type: 'syncDrawingData',
        roomId,
        drawingData: JSON.stringify(drawingData),
        hostName: userName
    });
};

const handleDrawingData = (data) => {
    try {
        store.dispatch(setDrawingData(data.drawingData));
        console.log(`Получены данные рисования`, data.drawingData);
    } catch (error) {
        console.error("Ошибка парсинга JSON:", error, data.drawingData);
    }
};
const handleUserLeft = (data) => {
    console.log(`Пользователь ${data.userName} покинул комнату.`);
    isConnecting = false;
};
// Общие события
const commonEvents = {
    requestDrawingData: (userName) => (data) => {
        console.log('Запрос данных рисования', {receivedData: data, currentUserName: userName});

        if (data.userName !== userName) {
            const drawingData = store.getState().drawing.drawingData;
            syncDrawingData(data.roomId, drawingData, userName);
        }
    },
    syncDrawingData: () => (data) => {
        handleDrawingData(data, 'sync');
    },
    draw: () => (data) => {
        handleDrawingData(data);
    },
    broadcastDrawingData: () => (data) => {
        handleDrawingData(data);
    },
    userLeft: () => (data) => handleUserLeft(data),
};
// Событие создания комнаты
const createRoomEvent = (roomName, userName, navigate, dispatch) => (data) => {
    console.log('Создание комнаты', {receivedData: data});
    dispatch(setRoomName(roomName));
    if (data.status === 'success') {
        dispatch(setHostName('Вы'));
        isConnecting = false;
        navigate(`/room/${data.roomId}`, {
            state: {userName, roomName, action: 'create', hostName: userName}
        }, {replace: true});
    } else {
        alert(data.message);
        isConnecting = false;
    }
};

const joinRoomEvent = (roomName, userName, roomId, navigate, dispatch) => (data) => {
    console.log('Подключение к комнате', {receivedData: data});

    if (data.status === 'success') {
        try {
            const drawings = data.drawingData ?? [];
            dispatch(setDrawingData(drawings));
            console.log('Текущие данные рисования установлены', drawings);
        } catch (error) {
            console.error("Ошибка парсинга JSON в joinRoom:", error, data.drawingData);
        }
        store.dispatch(setRoomName(data.roomName));
        dispatch(setHostName(data.hostName));
        isConnecting = false;
        sendMessage({type: 'requestDrawingData', roomId, userName});

        navigate(`/room/${roomId}`, {
            state: {userName, roomName: data.roomName, action: 'join', hostName: data.hostName, roomId: data.roomId}  // Pass roomName from server response
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
export const createRoom = (userName, roomName, navigate, dispatch) => {
    if (isConnecting || isSocketConnected()) return;
    isConnecting = true;

    const events = {
        requestDrawingData: commonEvents.requestDrawingData(userName),
        syncDrawingData: commonEvents.syncDrawingData(),
        broadcastDrawingData: commonEvents.broadcastDrawingData(),
        draw: commonEvents.draw(roomName, userName),
        roomCreated: (data) => createRoomEvent(roomName, userName, navigate, dispatch)(data),
        userLeft: commonEvents.userLeft(),
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

// Подключение к комнате
export const joinRoom = (userName, roomName, roomId, navigate, dispatch) => {
    if (isConnecting || isSocketConnected()) return;
    isConnecting = true;

    const events = {
        requestDrawingData: commonEvents.requestDrawingData(userName),
        syncDrawingData: commonEvents.syncDrawingData(),
        broadcastDrawingData: commonEvents.broadcastDrawingData(),
        draw: commonEvents.draw(roomId, userName),
        joinRoom: (data) => joinRoomEvent(userName, roomName, roomId, navigate, dispatch)(data),
        userLeft: commonEvents.userLeft(),
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
