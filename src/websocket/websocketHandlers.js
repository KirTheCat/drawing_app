import {sendMessage, on, off, connectSocket, isSocketConnected} from './WebSocket';
import {appendDrawingData, setDrawingData} from '../redux/slicers/drawingSlice';
import store from '../redux/store';

let isConnecting = false;

export const syncDrawingData = (roomId, drawingData, userName) => {
    sendMessage({
        type: 'syncDrawingData',
        roomId,
        drawingData: JSON.stringify(drawingData),
        hostName: userName
    });
};

const handleBroadcastDrawingData = (data) => {
    try {
        const receivedLines = JSON.parse(data.drawingData);
        store.dispatch(setDrawingData(receivedLines));
        console.log('Получены данные для трансляции рисования', receivedLines);
    } catch (error) {
        console.error("Ошибка парсинга JSON:", error, data.drawingData);
    }
};

// Общие события
const commonEvents = {
    requestDrawingData: (userName) => (data) => {
        console.log('Запрос данных рисования', {receivedData: data});

        if (data.userName !== userName) {
            const drawingData = store.getState().drawing.drawingData;
            syncDrawingData(data.roomId, drawingData, data.userName);
        }
    },

    syncDrawingData: () => (data) => {
        console.log('СИНХРОНИЗАЦИЯ. Полученые данные:', {receivedData: data});
        const drawings = JSON.parse(data.drawingData);
        store.dispatch(appendDrawingData(drawings));
    },

    draw: () => (data) => {
        try {
            const receivedLines = JSON.parse(data.drawingData);
            store.dispatch(setDrawingData(receivedLines));
            console.log('Получены данные рисования', receivedLines);
        } catch (error) {
            console.error("Ошибка парсинга JSON:", error, data.drawingData);
        }
    },
    broadcastDrawingData: () => (data) => {
        try {
            const receivedLines = JSON.parse(data.drawingData);
            store.dispatch(setDrawingData(receivedLines));
            console.log('Получены данные для трансляции рисования', receivedLines);
        } catch (error) {
            console.error("Ошибка парсинга JSON:", error, data.drawingData);
        }
    },
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
const joinRoomEvent = (roomName, userName, roomId, setCurrentRoomName, setHostName, navigate) => (data) => {
    console.log('Подключение к комнате', {receivedData: data});

    if (data.status === 'success') {
        const drawings = data.drawingData.map(d => JSON.parse(d));
        store.dispatch(setDrawingData(drawings));
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
export const createRoom = (userName, roomName, navigate, setCurrentRoomName, setHostName) => {
    if (isConnecting || isSocketConnected()) return;
    isConnecting = true;

    const events = {
        requestDrawingData: commonEvents.requestDrawingData(userName),
        syncDrawingData: commonEvents.syncDrawingData(),
        broadcastDrawingData: commonEvents.broadcastDrawingData(),
        draw: commonEvents.draw(roomName, userName),
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

export const joinRoom = (userName, roomName, roomId, navigate, setCurrentRoomName, setHostName) => {
    if (isConnecting || isSocketConnected()) return;
    isConnecting = true;

    const events = {
        requestDrawingData: commonEvents.requestDrawingData(userName),
        syncDrawingData: commonEvents.syncDrawingData(),
        broadcastDrawingData: commonEvents.broadcastDrawingData(),
        draw: commonEvents.draw(roomId, userName),
        joinRoom: joinRoomEvent(roomName, userName, roomId, setCurrentRoomName, setHostName, navigate)
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
