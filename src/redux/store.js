import {configureStore} from '@reduxjs/toolkit';
import drawingReducer from './slicers/drawingSlice';

const store = configureStore({
    reducer: {
        drawing: drawingReducer,
    },
});
export default store;