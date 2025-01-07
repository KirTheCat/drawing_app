// LineComponent.js
import React from 'react';
import {Line} from 'react-konva';


const LineComponent = ({line}) => {
    const strokeColor = line.tool === 'eraser'
        ? '#FFFFFF'
        : line.color && typeof line.color === 'object' && line.color.r !== undefined && line.color.g !== undefined && line.color.b !== undefined
            ? `rgb(${line.color.r}, ${line.color.g}, ${line.color.b})`
            : typeof line.color === 'string'
                ? line.color
                : 'black';
    return (
        <Line
            points={line.points}
            stroke={strokeColor}
            strokeWidth={line.brushRadius}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
        />
    );
};

export default LineComponent;