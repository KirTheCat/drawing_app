import {useRef, useEffect} from 'react';
import {debounce} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {off, on, sendMessage} from '../websocket/WebSocket';
import {syncDrawingData} from '../websocket/websocketHandlers';
import {setDrawingData, appendDrawingData} from '../redux/slicers/drawingSlice';

const useDrawing = ({color, brushRadius, eraserActive, onDraw, isConnected, roomId, userName}) => {
    const dispatch = useDispatch();
    const lines = useSelector((state) => state.drawing.drawingData);
    const isDrawing = useRef(false);

    const debouncedSendMessage = debounce((message) => {
        sendMessage(message);
    }, 100);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        dispatch(appendDrawingData([{
            tool: eraserActive ? 'eraser' : 'pen',
            points: [point.x, point.y],
            color,
            brushRadius
        }]));
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const newLines = [...lines];
        const lastLine = {...newLines[newLines.length - 1]};
        lastLine.points = [...lastLine.points, point.x, point.y];
        newLines[newLines.length - 1] = lastLine;
        dispatch(setDrawingData(newLines));
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
            sendMessage({type: 'broadcastDrawingData', roomId, drawingData: JSON.stringify(lines)});
        }
    }, [isConnected, roomId, userName]); // lines,

    useEffect(() => {
        const handleBroadcastDrawingData = (data) => {
            const drawing = JSON.parse(data.drawingData);
            if (drawing?.points) {
                dispatch(appendDrawingData([drawing]));
                console.log('Получены данные для трансляции рисования', drawing);
            }
        };

        on('broadcastDrawingData', handleBroadcastDrawingData);

        return () => {
            off('broadcastDrawingData', handleBroadcastDrawingData);
        };
    }, [dispatch]);

    return {
        lines,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
};

export default useDrawing;
