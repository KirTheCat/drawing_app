import React from 'react';
import {Box, Button, ButtonGroup, IconButton, Typography, Avatar} from '@mui/material';
import {MuiColorInput} from 'mui-color-input';
import Slider from '@mui/material/Slider';

function ToolsMenu({
                       color,
                       setColor,
                       brushRadius,
                       setBrushRadius,
                       eraserActive,
                       setEraserActive,
                       fillActive,
                       // setFillActive
                   }) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <MuiColorInput
                format="hex"
                value={color}
                onChange={(newValue) => setColor(newValue)}
                margin="normal"
                sx={{width: '100%', marginBottom: 2}}
            />
            <Typography variant="body2" gutterBottom>Размер кисти</Typography>
            <Slider
                value={brushRadius}
                onChange={(e, newValue) => setBrushRadius(newValue)}
                aria-labelledby="brush-radius-slider"
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={50}
                sx={{width: '100%', marginBottom: 2}}
            />
            <ButtonGroup sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <IconButton
                    variant="contained"
                    color={!eraserActive && !fillActive ? "primary" : "default"}
                    onClick={() => {
                        setEraserActive(false);
                        // setFillActive(false);
                    }}
                    sx={{
                        width: 'calc(100% / 3)',
                        height: 'calc(100% / 3)',
                        maxWidth: '80px', maxHeight: '80px',
                        minWidth: '60px', minHeight: '60px',
                        padding: 0,
                        borderRadius: 1,
                    }}
                >
                    <Avatar src="/img/drawIcon.png" alt="Рисование" sx={{width: '40px', height: '40px'}}
                            variant="square"/>
                </IconButton>
                //СТЁРКА
                <IconButton
                    variant="contained"
                    color={eraserActive ? "secondary" : "default"}
                    onClick={() => {
                        setEraserActive(true);
                        // setFillActive(false);
                    }}
                    sx={{
                        width: 'calc(100% / 3)',
                        height: 'calc(100% / 3)',
                        maxWidth: '80px', maxHeight: '80px',
                        minWidth: '60px', minHeight: '60px',
                        padding: 0,
                        borderRadius: 1,
                    }}
                >
                    <Avatar src="/img/eraseIcon.png" alt="Стирание" sx={{width: '40px', height: '40px'}}
                            variant="square"/>
                </IconButton>
                //ЗАЛИВКА
                <IconButton
                    variant="contained"
                    color={fillActive ? "secondary" : "default"}
                    onClick={() => {
                        // setFillActive(true);
                        setEraserActive(false);
                    }}
                    sx={{
                        width: 'calc(100% / 3)',
                        height: 'calc(100% / 3)',
                        maxWidth: '80px', maxHeight: '80px',
                        minWidth: '60px', minHeight: '60px',
                        padding: 0,
                        borderRadius: 1,
                    }}
                >
                    <Avatar src="/img/fillIcon.png" alt="Заливка" sx={{width: '40px', height: '40px'}}
                            variant="square"/>
                </IconButton>
            </ButtonGroup>
        </Box>
    );
}

export default ToolsMenu;