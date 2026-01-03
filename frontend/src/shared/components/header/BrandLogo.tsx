import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logoFull from '@/assets/logo/logo-full.png';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';

export const BrandLogo: React.FC = () => {
    const { track } = useTelemetry();

    return (
        <Box
            component={Link}
            to="/dashboard"
            sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: 4,
                '&:hover': {
                    opacity: 0.9,
                },
            }}
            onClick={() => {
                track({
                    event_name: 'navigation.logo_clicked',
                    event_version: 'v1',
                    classification: 'USER_ACTION',
                });
            }}
        >
            <img
                src={logoFull}
                alt="Aequitas Logo"
                style={{ height: '32px', display: 'block' }}
            />
        </Box>
    );
};
