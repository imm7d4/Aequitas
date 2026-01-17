import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#bdbdbd transparent',
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '*::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: '#bdbdbd',
                    borderRadius: '20px',
                    border: '2px solid transparent',
                    backgroundClip: 'content-box',
                    '&:hover': {
                        backgroundColor: '#9e9e9e',
                    },
                },
            },
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
