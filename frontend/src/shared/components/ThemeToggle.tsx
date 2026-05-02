import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useColorMode } from '@/app/providers';

export function ThemeToggle(): JSX.Element {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();

    return (
        <IconButton 
            onClick={toggleColorMode} 
            color="inherit"
            sx={{
                padding: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'rotate(15deg) scale(1.1)',
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(0, 240, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.05)',
                    color: theme.palette.mode === 'dark' ? '#00F0FF' : 'inherit',
                }
            }}
        >
            {theme.palette.mode === 'dark' ? (
                <Brightness7 sx={{ fontSize: 20 }} />
            ) : (
                <Brightness4 sx={{ fontSize: 20 }} />
            )}
        </IconButton>
    );
}
