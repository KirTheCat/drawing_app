import {createSlice} from '@reduxjs/toolkit';

const drawingSlice = createSlice({
    name: 'drawing',
    initialState: {
        color: {r: 0, g: 0, b: 0},
        brushRadius: 5,
        eraserActive: false,
        drawingData: [],
        fillActive: false,
    },
    reducers: {
        setColor: (state, action) => {
            state.color = action.payload;
        },
        setBrushRadius: (state, action) => {
            state.brushRadius = action.payload;
        },
        setEraserActive: (state, action) => {
            state.eraserActive = action.payload;
        },
        setDrawingData: (state, action) => {
            state.drawingData = action.payload;
        },
        appendDrawingData: (state, action) => {
            state.drawingData.push(action.payload);
        },
    },
});

export const {
    setColor,
    setBrushRadius,
    setEraserActive,
    setDrawingData,
    appendDrawingData,
} = drawingSlice.actions;

export default drawingSlice.reducer;