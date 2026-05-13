import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material';
import { ReactNode, createContext, useContext, useMemo, useState, useEffect } from 'react';

// Theme persistence key
const THEME_STORAGE_KEY = 'aequitas-theme-mode';

interface ColorModeContextType {
    toggleColorMode: () => void;
    setColorMode: (mode: PaletteMode | 'system') => void;
    mode: PaletteMode;
}

export const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => {},
    setColorMode: () => {},
    mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light mode palette
                primary: {
                    main: '#0f172a',
                    light: '#334155',
                    dark: '#020617',
                },
                secondary: {
                    main: '#3b82f6',
                },
                background: {
                    default: '#f8fafc',
                    paper: '#ffffff',
                },
                divider: 'rgba(0, 0, 0, 0.06)',
            }
            : {
                // Banker Dark palette
                primary: {
                    main: '#00F0FF', // Electric Cyan
                    light: '#66f5ff',
                    dark: '#00a3ad',
                },
                secondary: {
                    main: '#D4AF37', // Muted Gold
                },
                background: {
                    default: '#050505', // Obsidian
                    paper: '#0a0a0a',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: 'rgba(255, 255, 255, 0.6)',
                },
                divider: 'rgba(255, 255, 255, 0.1)',
            }),
        success: {
            main: '#10b981',
            light: mode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.2)',
            '50': mode === 'light' ? '#ecfdf5' : 'rgba(16, 185, 129, 0.1)',
            '100': mode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
        },
        error: {
            main: '#ef4444',
            light: mode === 'light' ? '#fee2e2' : 'rgba(239, 68, 68, 0.2)',
            '50': mode === 'light' ? '#fef2f2' : 'rgba(239, 68, 68, 0.1)',
            '100': mode === 'light' ? '#fee2e2' : 'rgba(239, 68, 68, 0.15)',
        },
        primary: {
            main: mode === 'light' ? '#0f172a' : '#00F0FF',
            '50': mode === 'light' ? '#f8fafc' : 'rgba(0, 240, 255, 0.1)',
            '100': mode === 'light' ? '#f1f5f9' : 'rgba(0, 240, 255, 0.15)',
        }
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
                    borderRadius: 12,
                    '&:hover': {
                        boxShadow: mode === 'dark' ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: mode === 'light' ? '#cbd5e1 transparent' : '#333 transparent',
                },
                '*::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                },
                '*::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: mode === 'light' ? '#cbd5e1' : '#333',
                    borderRadius: '20px',
                    '&:hover': {
                        backgroundColor: mode === 'light' ? '#94a3b8' : '#00F0FF',
                    },
                },
                'body': {
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: mode === 'light' ? '#f8fafc' : '#050505',
                    color: mode === 'light' ? '#0f172a' : '#ffffff',
                    overflowX: 'hidden',
                },
                '.MuiPaper-root': {
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '.MuiButton-root': {
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '.MuiTypography-root': {
                    transition: 'color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '.MuiSvgIcon-root': {
                    transition: 'color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '.MuiDivider-root': {
                    transition: 'border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }
            },
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
    const [mode, setMode] = useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode === 'system' || !savedMode) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return savedMode as PaletteMode;
    });

    useEffect(() => {
        const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setMode(e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem(THEME_STORAGE_KEY, newMode);
                    return newMode;
                });
            },
            setColorMode: (newMode: PaletteMode | 'system') => {
                if (newMode === 'system') {
                    const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    setMode(systemMode);
                } else {
                    setMode(newMode);
                }
                localStorage.setItem(THEME_STORAGE_KEY, newMode);
            },
            mode,
        }),
        [mode]
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode) as any), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
