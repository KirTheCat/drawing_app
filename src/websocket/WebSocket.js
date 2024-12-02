let socket = null;
let socketConnected = false;
const eventHandlers = {};

const connectSocket = (url, onOpen, onMessage, onClose) => {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return;
    }

    socket = new WebSocket(url);

    socket.onopen = () => {
        socketConnected = true;
        if (onOpen) onOpen();
    };

    socket.onmessage = (event) => {
        if (onMessage) onMessage(event);
        const data = JSON.parse(event.data);
        if (eventHandlers[data.type]) {
            eventHandlers[data.type].forEach(handler => handler(data));
        }
    };

    socket.onclose = () => {
        socketConnected = false;
        if (onClose) onClose();
    };
};

const sendMessage = (message) => {
    if (socketConnected && socket) {
        socket.send(JSON.stringify(message));
    }
};

const closeSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};

const on = (eventType, handler) => {
    if (!eventHandlers[eventType]) {
        eventHandlers[eventType] = [];
    }
    eventHandlers[eventType].push(handler);
};

const off = (eventType, handler) => {
    if (eventHandlers[eventType]) {
        eventHandlers[eventType] = eventHandlers[eventType].filter(h => h !== handler);
    }
};

const isSocketConnected = () => socketConnected;

export { connectSocket, sendMessage, closeSocket, on, off, isSocketConnected };
