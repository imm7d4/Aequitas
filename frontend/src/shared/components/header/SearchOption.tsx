import React from 'react';
import { Box, Typography } from '@mui/material';
import {
    History as HistoryIcon,
} from '@mui/icons-material';

import type { Instrument } from '@/features/instruments/types/instrument.types';

interface SearchOptionProps {
    props: React.HTMLAttributes<HTMLLIElement>;
    option: Instrument;
    isHistory: boolean;
}

export const SearchOption: React.FC<SearchOptionProps> = ({ props, option, isHistory }) => {

    return (
        <li {...props} key={option.id} style={{ padding: '4px 12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', py: 0.5 }}>
                {isHistory ? (
                    <HistoryIcon sx={{ mr: 2, fontSize: 20, color: 'text.disabled' }} />
                ) : (
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{
                            minWidth: 60,
                            fontWeight: 800,
                            color: 'primary.main',
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            textAlign: 'center',
                            fontSize: '0.75rem'
                        }}>
                            {option.symbol}
                        </Typography>
                    </Box>
                )}
                <Box sx={{ flexGrow: 1, ml: isHistory ? 0 : 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                        {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        {option.exchange} • {option.type}
                    </Typography>
                </Box>

            </Box>
        </li>
    );
};
