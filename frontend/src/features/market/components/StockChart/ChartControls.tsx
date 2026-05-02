import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CandleInterval } from '../../types/market.types';

interface ChartControlsProps {
    interval: CandleInterval;
    onIntervalChange: (newInterval: CandleInterval) => void;
}

export const ChartControls = ({ interval, onIntervalChange }: ChartControlsProps) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
            <ToggleButtonGroup
                value={interval}
                exclusive
                onChange={(_e, val) => val && onIntervalChange(val)}
                size="small"
                aria-label="time interval"
            >
                <ToggleButton value="1m">1M</ToggleButton>
                <ToggleButton value="5m">5M</ToggleButton>
                <ToggleButton value="15m">15M</ToggleButton>
                <ToggleButton value="1h">1H</ToggleButton>
                <ToggleButton value="1d">1D</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};
