//useDrawing.js
import {useState, useRef, useEffect} from 'react';
import {debounce} from 'lodash';
import {off, on, sendMessage} from '../websocket/WebSocket';
import {syncDrawingData} from '../websocket/websocketHandlers';

const useDrawing = ({color, brushRadius, eraserActive, isConnected, roomId, drawingData, userName}) => {
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    useEffect(() => {
        setLines(drawingData);
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

    // const handleMouseMove = (e) => {
    //     if (!isDrawing.current) return;
    //     const stage = e.target.getStage();
    //     const point = stage.getPointerPosition();
    //     const lastLine = lines[lines.length - 1];
    //     lastLine.points = lastLine.points.concat([point.x, point.y]);
    //     setLines([...lines]);
    // };
    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setLines((prevLines) => {
            const lastLine = prevLines[prevLines.length - 1];
            if (lastLine) {
                lastLine.points = lastLine.points.concat([point.x, point.y]);
            }
            return [...prevLines];
        });
    };
    // const handleMouseUp = () => {
    //     isDrawing.current = false;
    //     const lastLine = lines[lines.length - 1];
    //     if (lastLine && lastLine.points.length > 0) {
    //         debouncedSendMessage({type: 'draw', roomId, drawingData: JSON.stringify(lastLine)});
    //         // sendMessage({type: 'broadcastDrawingData', roomId, drawingData: JSON.stringify(lastLine)});
    //     }
    // };
    const handleMouseUp = () => {
        isDrawing.current = false;
        if (lines.length > 0) {
            debouncedSendMessage({type: 'draw', roomId, drawingData: JSON.stringify(lines)});
        }
    };
    useEffect(() => {
        if (isConnected) {
            syncDrawingData(roomId, lines, userName);
        }
    }, [lines, isConnected, roomId, userName]);

    useEffect(() => {
        const handleBroadcastDrawingData = (data) => {
            try {
                const receivedLines = JSON.parse(data.drawingData);
                setLines(prevLines => [...prevLines, ...receivedLines]);
                console.log('Получены данные для трансляции рисования', receivedLines);
            } catch (error) {
                console.error("Ошибка парсинга JSON:", error, data.drawingData);
            }
        };

        const handleJoinRoom = (data) => {
            let drawings = [];
            if (data.drawingData) {
                drawings = data.drawingData.map(d => {
                    try {
                        return typeof d === 'string' ? JSON.parse(d) : d;
                    } catch (error) {
                        console.error("Ошибка парсинга JSON в handleJoinRoom:", error, d);
                        return null;
                    }
                }).filter(Boolean);
                setLines(drawings);
                console.log('Данные рисования установлены при подключении к комнате', drawings);
            } else {
                setLines([]);
                console.log("Нет данных для рисования при подключении к комнате");
            }
        };


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