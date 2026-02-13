import React from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Paper,
    Collapse,
    IconButton,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useIndicatorStore } from '../store/indicatorStore';

interface IndicatorPanelProps {
    instrumentId: string;
}

export const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ instrumentId }) => {
    const [expanded, setExpanded] = React.useState(false);
    const { getIndicators, toggleIndicator } = useIndicatorStore();
    const indicators = getIndicators(instrumentId);

    return (
        <Paper
            id="indicator-panel"
            elevation={0}
            sx={{
                borderTop: 1,
                borderColor: 'divider',
                borderRadius: 0
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: 'action.hover'
                    }
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Typography variant="subtitle2" fontWeight={600}>
                    📊 Technical Indicators
                </Typography>
                <IconButton size="small">
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={indicators.sma.enabled}
                                    onChange={() => toggleIndicator(instrumentId, 'sma')}
                                    size="small"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        SMA (Simple Moving Average)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Periods: 20, 50, 200
                                    </Typography>
                                </Box>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={indicators.ema.enabled}
                                    onChange={() => toggleIndicator(instrumentId, 'ema')}
                                    size="small"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        EMA (Exponential Moving Average)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Periods: 9, 21, 50
                                    </Typography>
                                </Box>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={indicators.rsi.enabled}
                                    onChange={() => toggleIndicator(instrumentId, 'rsi')}
                                    size="small"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        RSI (Relative Strength Index)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Period: 14 | Oscillator (0-100)
                                    </Typography>
                                </Box>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={indicators.macd.enabled}
                                    onChange={() => toggleIndicator(instrumentId, 'macd')}
                                    size="small"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        MACD (Moving Average Convergence Divergence)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Settings: 12, 26, 9
                                    </Typography>
                                </Box>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={indicators.bollingerBands.enabled}
                                    onChange={() => toggleIndicator(instrumentId, 'bollingerBands')}
                                    size="small"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        Bollinger Bands
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Period: 20 | StdDev: 2
                                    </Typography>
                                </Box>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={indicators.vwap.enabled}
                                    onChange={() => toggleIndicator(instrumentId, 'vwap')}
                                    size="small"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        VWAP (Volume Weighted Average Price)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Intraday volume-weighted average
                                    </Typography>
                                </Box>
                            }
                        />
                    </FormGroup>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        💡 Indicators calculated from last 100 candles
                    </Typography>
                </Box>
            </Collapse>
        </Paper>
    );
};
