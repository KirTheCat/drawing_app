import React from 'react';
import {Box, FormControlLabel, Checkbox,  Slider} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';

function ToolsMenu({ color, setColor, brushRadius, setBrushRadius, eraserActive, setEraserActive }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%' }}>

            <MuiColorInput
                format="hex"
                value={color}
                onChange={(newValue) => setColor(newValue)}
                margin="normal"
                padding="normal"
            />
            Размер кисти
            <Slider
                value={brushRadius}
                onChange={(e, newValue) => setBrushRadius(newValue)}
                aria-labelledby="brush-radius-slider"
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={50}
                sx={{ width: '50%', marginBottom: 2 }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={eraserActive}
                        onChange={(e) => setEraserActive(e.target.checked)}
                    />
                }
                label="Режим стирания"
            />
        </Box>
    );
}

export default ToolsMenu;
