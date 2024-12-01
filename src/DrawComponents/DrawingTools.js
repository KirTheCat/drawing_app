
export const getLineCoordinates = (x, y, prevX, prevY) => {
    const dx = Math.abs(x - prevX);
    const dy = Math.abs(y - prevY);
    const sx = x < prevX ? 1 : -1;
    const sy = y < prevY ? 1 : -1;
    let error = dx - dy;
    const coordinates = [];

    while (true) {
        coordinates.push({ x, y });
        if (x === prevX && y === prevY) break;
        const doubleError = error * 2;
        if (doubleError > -dy) {
            error -= dy;
            x += sx;
        }
        if (doubleError < dx) {
            error += dx;
            y += sy;
        }
    }

    return coordinates;
};

export const erase = (event, canvasRef, brushRadius, eraserActive, oldCoords) => {
    if (eraserActive && event.buttons === 1) {
        const ctx = canvasRef.current.ctx.drawing;
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        if (oldCoords.current.x !== null) {
            getLineCoordinates(x, y, oldCoords.current.x, oldCoords.current.y).forEach(({ x, y }) => {
                ctx.clearRect(x - brushRadius / 2, y - brushRadius / 2, brushRadius, brushRadius);
            });
        }
        oldCoords.current = { x, y };
    } else {
        oldCoords.current = { x: null, y: null };
    }
};
