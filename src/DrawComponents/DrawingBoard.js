import React, { useRef, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Box } from '@mui/material';

function DrawingBoard({ color, brushRadius, eraserActive, drawingData, onDraw }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.clear();
            drawingData.forEach((data) => {
                canvasRef.current.loadSaveData(data, true);
            });
        }
    }, [drawingData]);

    const handleDraw = () => {
        if (typeof onDraw === 'function') {
            const saveData = canvasRef.current.getSaveData();
            onDraw(saveData);
        }
    };

    return (
        <Box
            sx={{
                border: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 800, // фиксированная ширина
                height: 600  // фиксированная высота
            }}
        >
            <CanvasDraw
                ref={canvasRef}
                brushColor={eraserActive ? '#FFFFFF' : color}
                brushRadius={brushRadius}
                canvasWidth={1800} // фиксированная ширина
                canvasHeight={1600} // фиксированная высота
                hideGrid
                onChange={handleDraw}
            />
        </Box>
    );
}

export default DrawingBoard;
