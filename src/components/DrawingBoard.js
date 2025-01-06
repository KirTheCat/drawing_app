// DrawingBoard.js
import React from 'react';
import {Stage, Layer} from 'react-konva';
import LineComponent from './LineComponent';
import useDrawing from '../hooks/useDrawing';

const DrawingBoard = React.forwardRef(({
                                           color,
                                           brushRadius,
                                           eraserActive,
                                           drawingData,
                                           isConnected,
                                           roomId
                                       }, ref) => {
    const {lines, handleMouseDown, handleMouseMove, handleMouseUp} = useDrawing({
        color,
        brushRadius,
        eraserActive,
        isConnected,
        roomId,
        drawingData
    });

    return (
        <div>
            <Stage
                width={900}
                height={700}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <LineComponent key={i} line={line}/>
                    ))}
                </Layer>
            </Stage>
        </div>
    );
});

export default DrawingBoard;