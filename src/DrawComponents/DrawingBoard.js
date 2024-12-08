import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Box } from '@mui/material';
import { debounce } from 'lodash';
import { sendMessage } from "../websocket/WebSocket";

const DrawingBoard = React.forwardRef(({ color, brushRadius, eraserActive, drawingData, onDraw, isConnected, roomId }, ref) => {
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    useEffect(() => {
        setLines(drawingData);
    }, [drawingData]);

    const debouncedSendMessage = debounce((message) => {
        if (isConnected) {
            sendMessage(message);
        }
    }, 100);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setLines((prevLines) => [...prevLines, { tool: eraserActive ? 'eraser' : 'pen', points: [point.x, point.y], color, brushRadius }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        const lastLine = lines[lines.length - 1];
        debouncedSendMessage({ type: 'draw', roomId, drawingData: JSON.stringify(lastLine) });
        onDraw(lastLine);
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                border: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Stage
                width={800}
                height={900}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={ref}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.tool === 'eraser' ? '#FFFFFF' : line.color}
                            strokeWidth={line.brushRadius}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
                        />
                    ))}
                </Layer>
            </Stage>
        </Box>
    );
});

export default DrawingBoard;
