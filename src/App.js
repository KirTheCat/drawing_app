import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {CssBaseline} from '@mui/material';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {
    return (
        <>
            <CssBaseline/>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/room/:roomId" element={<Room/>}/>
                </Routes>
            </Router>
        </>
    );
}

export default App;
