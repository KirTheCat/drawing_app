// DrawingBoard.js
import React from 'react';
import {Stage, Layer} from 'react-konva';
import LineComponent from './LineComponent';
import useDrawing from '../hooks/useDrawing';
import {useSelector} from "react-redux";

const DrawingBoard = React.forwardRef((props, ref) => {
    const color = useSelector((state) => state.drawing.color);
    const brushRadius = useSelector((state) => state.drawing.brushRadius);
    const eraserActive = useSelector((state) => state.drawing.eraserActive);
    const drawingData = useSelector((state) => state.drawing.drawingData);
    const isConnected = useSelector((state) => state.room.isConnected)
    const roomId = useSelector(state => state.room.roomId)

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
                style={{border: '1px solid black'}}
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