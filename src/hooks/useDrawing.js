import {useState, useRef, useEffect} from 'react';
import {debounce} from 'lodash';
import {off, on, sendMessage} from '../websocket/WebSocket';
import {syncDrawingData} from '../websocket/websocketHandlers';

const useDrawing = ({color, brushRadius, eraserActive, onDraw, isConnected, roomId, drawingData, userName}) => {
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    useEffect(() => {
        console.log('Инициализация данных рисования', drawingData);
        setLines([...drawingData]);
    }, [drawingData]);

    const debouncedSendMessage = debounce((message) => {
        sendMessage(message);
    }, 100);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setLines((prevLines) => [...prevLines, {
            tool: eraserActive ? 'eraser' : 'pen',
            points: [point.x, point.y],
            color,
            brushRadius
        }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        setLines([...lines]);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        const lastLine = lines[lines.length - 1];
        if (lastLine && lastLine.points.length > 0) {
            debouncedSendMessage({type: 'draw', roomId, drawingData: JSON.stringify(lastLine)});
            onDraw(lastLine);
            sendMessage({type: 'broadcastDrawingData', roomId, drawingData: JSON.stringify(lastLine)});
        }
    };

    useEffect(() => {
        if (isConnected) {
            syncDrawingData(roomId, lines, userName);
        }
    }, [lines, isConnected, roomId, userName]);

    useEffect(() => {
        const handleBroadcastDrawingData = (data) => {
            const drawing = JSON.parse(data.drawingData);
            if (drawing?.points) {
                setLines((prevLines) => [...prevLines, drawing]);
                console.log('Получены данные для трансляции рисования', drawing); // Лог для отладки
            }
        };

        const handleJoinRoom = (data) => {
            if (data.drawingData) {
                const drawings = data.drawingData.map(d => JSON.parse(d));
                setLines(drawings);
                console.log('Данные рисования установлены при подключении к комнате', drawings); // Лог для отладки
            }
        };

        // Подписка на события
        on('broadcastDrawingData', handleBroadcastDrawingData);
        on('joinRoom', handleJoinRoom);

        return () => {
            off('broadcastDrawingData', handleBroadcastDrawingData);
            off('joinRoom', handleJoinRoom);
        };
    }, []);

    return {
        lines,
        setLines,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
};

export default useDrawing;
