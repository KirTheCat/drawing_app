import {useState, useRef, useEffect} from 'react';
import {debounce} from 'lodash';
import {sendMessage} from '../websocket/WebSocket';

const useDrawing = ({color, brushRadius, eraserActive, onDraw, isConnected, roomId, drawingData, userName}) => {
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    useEffect(() => {
        setLines(prevLines => [...prevLines, ...drawingData]);
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
        debouncedSendMessage({type: 'draw', roomId, drawingData: JSON.stringify(lastLine)});
        broadcastDrawingData(lines, roomId, userName);  // Обратите внимание на вызов этой функции
        onDraw(lastLine);
    };

    const broadcastDrawingData = (drawingData, roomId, userName) => {
        sendMessage({
            type: 'broadcastDrawingData',
            roomId,
            drawingData: JSON.stringify(drawingData),
            hostName: userName
        });
    };

    return {
        lines,
        setLines,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
};

export default useDrawing;
