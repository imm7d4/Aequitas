import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface LoaderProps {
    message?: string;
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
    message,
    fullScreen = false,
    size = 'medium',
    color
}) => {
    const theme = useTheme();
    const loaderColor = color || theme.palette.primary.main;

    const sizes = {
        small: { width: 40, height: 20, barWidth: 3, gap: 2 },
        medium: { width: 80, height: 40, barWidth: 6, gap: 4 },
        large: { width: 120, height: 60, barWidth: 8, gap: 6 }
    };

    const current = sizes[size];

    const containerStyle = fullScreen ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backgroundColor: alpha(theme.palette.background.default, 0.85),
        backdropFilter: 'blur(12px)',
    } : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        width: '100%',
    };

    // 5 bars with different heights to mimic a bar chart/volume
    const bars = [0.4, 0.8, 0.6, 1.0, 0.5];

    return (
        <Box sx={containerStyle}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: `${current.gap}px`,
                height: current.height,
                mb: message ? 3 : 0
            }}>
                {bars.map((heightFactor, index) => (
                    <motion.div
                        key={index}
                        style={{
                            width: current.barWidth,
                            backgroundColor: loaderColor,
                            borderRadius: current.barWidth / 2,
                        }}
                        initial={{ height: current.height * 0.2, opacity: 0.3 }}
                        animate={{ 
                            height: [
                                current.height * heightFactor * 0.4, 
                                current.height * heightFactor, 
                                current.height * heightFactor * 0.4
                            ],
                            opacity: [0.3, 1, 0.3],
                            backgroundColor: index % 2 === 0 ? loaderColor : alpha(loaderColor, 0.7)
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: index * 0.15,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </Box>

            {message && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Typography
                        variant={size === 'small' ? 'caption' : 'body2'}
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: theme.palette.text.primary,
                            textAlign: 'center',
                            fontSize: size === 'small' ? '0.65rem' : '0.75rem',
                            opacity: 0.8
                        }}
                    >
                        {message}
                    </Typography>
                </motion.div>
            )}
        </Box>
    );
};
