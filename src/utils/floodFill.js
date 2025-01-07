// ../utils/floodFill.js
export function floodFill(imageData, x, y, fillColor) {

    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const targetColor = getPixelColor(imageData, x, y);

    if (colorsMatch(targetColor, fillColor)) {
        return;
    }

    const stack = [[x, y]];

    while (stack.length) {
        const [currentX, currentY] = stack.pop();

        if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) {
            continue;
        }

        const currentColor = getPixelColor(imageData, currentX, currentY);

        if (colorsMatch(currentColor, targetColor)) {
            setPixelColor(imageData, currentX, currentY, fillColor);

            stack.push([currentX + 1, currentY]);
            stack.push([currentX - 1, currentY]);
            stack.push([currentX, currentY + 1]);
            stack.push([currentX, currentY - 1]);
        }
    }
}

function getPixelColor(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return [
        imageData.data[index],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3],
    ];
}

function setPixelColor(imageData, x, y, color) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = color[3];
}

function colorsMatch(color1, color2) {
    if (!color1 || !color2) return false;
    return (
        color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2] &&
        color1[3] === color2[3]
    );
}