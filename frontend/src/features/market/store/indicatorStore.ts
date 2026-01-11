import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IndicatorConfig {
    enabled: boolean;
    settings: {
        period?: number;
        periods?: number[]; // For multiple periods like SMA(20, 50, 200)
        fastPeriod?: number;
        slowPeriod?: number;
        signalPeriod?: number;
        stdDev?: number;
    };
    color?: string;
    lineWidth?: number;
}

export interface InstrumentIndicators {
    sma: IndicatorConfig;
    ema: IndicatorConfig;
    rsi: IndicatorConfig;
    macd: IndicatorConfig;
    bollingerBands: IndicatorConfig;
    vwap: IndicatorConfig;
}

interface IndicatorState {
    // Per-instrument indicator selections
    instrumentIndicators: Record<string, InstrumentIndicators>;

    // Actions
    toggleIndicator: (instrumentId: string, indicator: keyof InstrumentIndicators) => void;
    updateSettings: (
        instrumentId: string,
        indicator: keyof InstrumentIndicators,
        settings: Partial<IndicatorConfig['settings']>
    ) => void;
    getIndicators: (instrumentId: string) => InstrumentIndicators;
}

const defaultIndicatorConfig: InstrumentIndicators = {
    sma: {
        enabled: false,
        settings: { periods: [20, 50, 200] },
        lineWidth: 2
    },
    ema: {
        enabled: false,
        settings: { periods: [9, 21, 50] },
        lineWidth: 2
    },
    rsi: {
        enabled: false,
        settings: { period: 14 },
        color: '#9C27B0',
        lineWidth: 2
    },
    macd: {
        enabled: false,
        settings: {
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9
        },
        lineWidth: 2
    },
    bollingerBands: {
        enabled: false,
        settings: {
            period: 20,
            stdDev: 2
        },
        color: '#757575',
        lineWidth: 1
    },
    vwap: {
        enabled: false,
        settings: {},
        color: '#FFC107',
        lineWidth: 2
    }
};

export const useIndicatorStore = create<IndicatorState>()(
    persist(
        (set, get) => ({
            instrumentIndicators: {},

            toggleIndicator: (instrumentId, indicator) => {
                set(state => {
                    const current = state.instrumentIndicators[instrumentId] || { ...defaultIndicatorConfig };
                    return {
                        instrumentIndicators: {
                            ...state.instrumentIndicators,
                            [instrumentId]: {
                                ...current,
                                [indicator]: {
                                    ...current[indicator],
                                    enabled: !current[indicator].enabled
                                }
                            }
                        }
                    };
                });
            },

            updateSettings: (instrumentId, indicator, settings) => {
                set(state => {
                    const current = state.instrumentIndicators[instrumentId] || { ...defaultIndicatorConfig };
                    return {
                        instrumentIndicators: {
                            ...state.instrumentIndicators,
                            [instrumentId]: {
                                ...current,
                                [indicator]: {
                                    ...current[indicator],
                                    settings: {
                                        ...current[indicator].settings,
                                        ...settings
                                    }
                                }
                            }
                        }
                    };
                });
            },

            getIndicators: (instrumentId) => {
                const state = get();
                return state.instrumentIndicators[instrumentId] || { ...defaultIndicatorConfig };
            }
        }),
        {
            name: 'indicator-storage',
            version: 1
        }
    )
);
