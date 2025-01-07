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
              }) => {
    const formBackgroundColor = isCreatingRoom ? 'component.body' : 'component.default';
    const headerBackgroundColor = isCreatingRoom ? 'component.header' : 'primary.main';
    const buttonColor = isCreatingRoom ? 'button.confirm' : 'button.confirm_2';

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Box sx={{
                padding: 0,
                borderRadius: 4,
                width: '600px',
                height: '500px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                backgroundColor: formBackgroundColor
            }}>
                <Box sx={{
                    flex: '0 0 auto',
                    width: '100%',
                    backgroundColor: headerBackgroundColor,
                    padding: 2,
                    borderRadius: '4px 4px 0 0',
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" component="div" gutterBottom>
                        {isCreatingRoom ? 'Создать комнату' : 'Подключиться к комнате'}
                    </Typography>
                </Box>
                <Box sx={{flex: '1 1 auto', padding: 2}}>
                    <TextField
                        label="Введите ваше имя"
                        value={userName}
                        onChange={setUserName}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{borderRadius: 2, marginBottom: 2, backgroundColor: 'component.default'}}
                    />
                    {isCreatingRoom ? (
                        <TextField
                            label="Введите название комнаты"
                            value={roomName}
                            onChange={setRoomName}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            sx={{borderRadius: 2, marginBottom: 2, backgroundColor: 'component.default'}}
                        />
                    ) : (
                        <TextField
                            label="Введите ID комнаты"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            sx={{borderRadius: 2, marginBottom: 2, backgroundColor: 'component.default'}}
                        />
                    )}
                </Box>
                <Box sx={{flex: '0 0 auto', width: '100%', padding: 2}}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!isCreatingRoom}
                                onChange={() => setIsCreatingRoom(!isCreatingRoom)}
                                name="roomSwitch"
                                color="primary"
                            />
                        }
                        label={isCreatingRoom ? "Подключиться к комнате" : "Создать комнату"}
                        sx={{justifyContent: 'center', display: 'flex', marginBottom: 2}}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: buttonColor,
                            ':hover': {
                                backgroundColor: buttonColor,
                            },
                        }}
                        onClick={handleAction}
                        fullWidth
                    >
                        {isCreatingRoom ? 'Создать комнату' : 'Подключиться к комнате'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Form;
