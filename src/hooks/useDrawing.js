//useDrawing.js
import {useState, useRef, useEffect} from 'react';
import {debounce} from 'lodash';
import {sendMessage} from '../websocket/WebSocket';

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

    const handleMouseUp = () => {
        isDrawing.current = false;
        if (lines.length > 0) {
            debouncedSendMessage({type: 'draw', roomId, drawingData: JSON.stringify(lines)});
        }
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