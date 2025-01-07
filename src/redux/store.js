import {configureStore} from '@reduxjs/toolkit';
import drawingReducer from './slicers/drawingSlice';
import roomReducer from './slicers/roomSlice';


const store = configureStore({
    reducer: {
        drawing: drawingReducer,
        room: roomReducer,
    },
});
export default store;