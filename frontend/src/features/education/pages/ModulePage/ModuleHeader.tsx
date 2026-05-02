import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ArrowBack as BackIcon, Timer as TimeIcon } from '@mui/icons-material';

interface ModuleHeaderProps {
    title: string;
    difficulty: string;
    estimatedTime: string;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ title, difficulty, estimatedTime }) => {
    return (
        <div className="module-header-compact">
            <Link to="/education" className="back-link">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BackIcon sx={{ fontSize: 16 }} />
                    Education
                </Box>
            </Link>
            <div className="header-content">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'var(--text-primary)' }}>
                    {title}
                </Typography>
                <div className="meta-inline">
                    <span className="badge-inline">{difficulty}</span>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 16 }} />
                        {estimatedTime}
                    </Box>
                </div>
            </div>
        </div>
    );
};
