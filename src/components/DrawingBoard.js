// DrawingBoard.js
import React from 'react';
import {Stage, Layer} from 'react-konva';
import {Box} from '@mui/material';
import LineComponent from './LineComponent';
import useDrawing from '../hooks/useDrawing';

const DrawingBoard = React.forwardRef(({
                                           color,
                                           brushRadius,
                                           eraserActive,
                                           drawingData,
                                           onDraw,
                                           isConnected,
                                           roomId
                                       }, ref) => {
    const {lines, handleMouseDown, handleMouseMove, handleMouseUp} = useDrawing({
        color,
        brushRadius,
        eraserActive,
        onDraw,
        isConnected,
        roomId,
        drawingData
    });

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
                        <LineComponent key={i} line={line}/>
                    ))}
                </Layer>
            </Stage>
        </Box>
    );
});

export default DrawingBoard;
