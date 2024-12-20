import {createSlice} from '@reduxjs/toolkit';

const drawingSlice = createSlice({
    name: 'drawing',
    initialState: {
        color: '#000000',
        brushRadius: 5,
        eraserActive: false,
        drawingData: [],
        currentRoomName: '',
        hostName: '',
        isConnected: false,
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
            state.drawingData = [...state.drawingData, ...action.payload];
        },
        setCurrentRoomName: (state, action) => {
            state.currentRoomName = action.payload;
        },
        setHostName: (state, action) => {
            state.hostName = action.payload;
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {
    setColor,
    setBrushRadius,
    setEraserActive,
    setDrawingData,
    setCurrentRoomName,
    setHostName,
    setIsConnected,
    appendDrawingData
} = drawingSlice.actions;
export default drawingSlice.reducer;