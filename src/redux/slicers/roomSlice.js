import {createSlice} from '@reduxjs/toolkit';

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        roomName: '',
        hostName: '',
        roomId: '',
        userName: '',
        isConnected: false,
    },
    reducers: {
        setRoomName: (state, action) => {
            state.roomName = action.payload;
        },
        setHostName: (state, action) => {
            state.hostName = action.payload;
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload;
        },
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});

export const {
    setRoomName,
    setHostName,
    setRoomId,
    setUserName,
    setIsConnected,
} = roomSlice.actions;

export default roomSlice.reducer;