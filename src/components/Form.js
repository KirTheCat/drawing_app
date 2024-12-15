import {Box, FormControlLabel, Switch, Typography, TextField, Button} from '@mui/material';

const Form = ({
                  isCreatingRoom,
                  setIsCreatingRoom,
                  userName,
                  setUserName,
                  roomName,
                  setRoomName,
                  roomId,
                  setRoomId,
                  handleAction
              }) => (
    <Box sx={{width: '25%', textAlign: 'center'}}>
        <FormControlLabel
            control={
                <Switch
                    checked={!isCreatingRoom}
                    onChange={() => setIsCreatingRoom(!isCreatingRoom)}
                    name="roomSwitch"
                    color="primary"
                />
            }
            label={isCreatingRoom ? "Создать комнату" : "Подключиться к комнате"}
        />
        <Typography variant="h4" gutterBottom>
            {isCreatingRoom ? 'Создать комнату' : 'Подключиться к комнате'}
        </Typography>
        <TextField
            label="Введите ваше имя"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            margin="normal"
        />
        {isCreatingRoom ? (
            <TextField
                label="Введите название комнаты"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                fullWidth
                margin="normal"
            />
        ) : (
            <TextField
                label="Введите ID комнаты"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                fullWidth
                margin="normal"
            />
        )}
        <Button variant="contained" color="primary" onClick={handleAction} fullWidth sx={{mt: 2}}>
            {isCreatingRoom ? 'Создать комнату' : 'Подключиться к комнате'}
        </Button>
    </Box>
);

export default Form;
