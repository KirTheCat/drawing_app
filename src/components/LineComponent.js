// LineComponent.js
import React from 'react';
import {Line} from 'react-konva';

const LineComponent = ({line}) => (
    <Line
        points={line.points}
        stroke={line.tool === 'eraser' ? '#FFFFFF' : line.color}
        strokeWidth={line.brushRadius}
        tension={0.5}
        lineCap="round"
        globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
    />
);

export default LineComponent;
