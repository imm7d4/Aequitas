import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0f172a', // Slate 900
            light: '#334155',
            dark: '#020617',
        },
        secondary: {
            main: '#3b82f6', // Blue 500
        },
        success: {
            main: '#10b981', // Emerald 500
            light: '#d1fae5',
        },
        error: {
            main: '#ef4444', // Red 500
            light: '#fee2e2',
        },
        background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
        },
        divider: 'rgba(0, 0, 0, 0.06)',
    },
    typography: {
        fontFamily: '"Inter", "Outfit", "Roboto", sans-serif',
        h5: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h6: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 transparent',
                },
                '*::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                },
                '*::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: '#cbd5e1',
                    borderRadius: '20px',
                    '&:hover': {
                        backgroundColor: '#94a3b8',
                    },
                },
                'body': {
                    backgroundColor: '#f8fafc',
                }
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
