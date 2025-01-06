import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#e3c1be', // Основной цвет
        },
        secondary: {
            main: '#FE7A47', // Второстепенный цвет
        },
        error: {
            main: '#D32F2F', // Цвет для ошибок (можно изменить по желанию)
        },
        background: {
            default: '#d5c8f1', // Цвет фона приложения
            paper: '#DBC3DE',   // Цвет бумаги для компонентов
        },
        component: {
            header: '#D5D8F2',
            body: '#ffffff',
            default: '#f0f8ff',
        },
        button: {
            confirm: '#7256f1',
            confirm_2: '#593de1',
            decline: '',
        },
        text: {
            light_1: '#62d7d7',
        }
    },


    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
    },
});

export default theme;
// Заголовок	#ffffff	Чистый белый
// Тело формы	#f0f8ff	Светло-голубой
// Поля ввода	Фон: #ffffff	Белый
// Текст: #333333	Темно-серый
// Кнопка подтверждения	Фон: #4c2fd7	Фиолетовый
// Текст: #ffffff	Белый