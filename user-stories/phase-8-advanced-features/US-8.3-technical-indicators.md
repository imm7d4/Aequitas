# US-8.3 - Automatic Technical Indicators

**Epic:** Advanced Trading Features  
**Phase:** Phase 8 - Enhanced Trading Experience  
**Status:** Completed  
**Priority:** High  
**Complexity:** Medium

## User Story

As a **trader**  
I want to **view technical indicators automatically calculated on charts**  
So that I can **make informed trading decisions based on technical analysis**.

## Business Context

Technical indicators help traders:
- Identify trends (SMA, EMA)
- Gauge momentum (RSI, MACD)
- Measure volatility (Bollinger Bands)
- Confirm entry/exit points

Automatic calculation removes manual work and provides instant insights.

## Acceptance Criteria

### 1. Indicator Selection Panel

**Display:**
- [ ] Collapsible panel below chart
- [ ] Checkbox list of available indicators
- [ ] Selected indicators shown on chart
- [ ] Settings icon for customization

**Available Indicators:**
- [ ] SMA (Simple Moving Average) - 20, 50, 200 day
- [ ] EMA (Exponential Moving Average) - 9, 21, 50 day
- [ ] RSI (Relative Strength Index) - 14 period
- [ ] MACD (Moving Average Convergence Divergence)
- [ ] Bollinger Bands (20, 2)
- [ ] VWAP (Volume Weighted Average Price)

---

### 2. Overlay Indicators (on main chart)

**SMA (Simple Moving Average):**
- [ ] Calculated from last 100 candles
- [ ] Three lines: SMA(20), SMA(50), SMA(200)
- [ ] Colors: Blue, Orange, Red
- [ ] Line width: 2px
- [ ] Smooth curves

**EMA (Exponential Moving Average):**
- [ ] Calculated from last 100 candles
- [ ] Three lines: EMA(9), EMA(21), EMA(50)
- [ ] Colors: Cyan, Purple, Pink
- [ ] Line width: 2px
- [ ] More responsive than SMA

**Bollinger Bands:**
- [ ] Middle band: SMA(20)
- [ ] Upper band: SMA(20) + 2 × StdDev
- [ ] Lower band: SMA(20) - 2 × StdDev
- [ ] Semi-transparent fill between bands
- [ ] Colors: Gray bands, light gray fill

**VWAP:**
- [ ] Calculated from intraday data
- [ ] Single line showing volume-weighted average
- [ ] Color: Yellow
- [ ] Resets daily

---

### 3. Sub-Chart Indicators (separate panels)

**RSI (Relative Strength Index):**
- [ ] Separate panel below main chart
- [ ] Height: 100px
- [ ] Range: 0-100
- [ ] Horizontal lines at 30 (oversold) and 70 (overbought)
- [ ] Line color: Purple
- [ ] Background zones:
  - 0-30: Light red (oversold)
  - 30-70: Neutral
  - 70-100: Light green (overbought)

**MACD:**
- [ ] Separate panel below RSI (if both enabled)
- [ ] Height: 120px
- [ ] Three components:
  - MACD line (12-26 EMA difference) - Blue
  - Signal line (9 EMA of MACD) - Red
  - Histogram (MACD - Signal) - Green/Red bars
- [ ] Zero line marked

---

### 4. Calculation Constraints

**Data Limitation:**
- [ ] Use last 100 candles available
- [ ] Indicators requiring more data (e.g., SMA(200)) will have partial data
- [ ] Show warning if insufficient data

**Performance:**
- [ ] Calculations done on frontend
- [ ] Use `technicalindicators` npm library
- [ ] Memoize results to avoid recalculation
- [ ] Update only on new candle

---

### 5. Indicator Customization

**Settings Dialog:**
- [ ] Click gear icon next to indicator name
- [ ] Adjust parameters:
  - SMA/EMA: Period (5-200)
  - RSI: Period (5-30)
  - Bollinger Bands: Period (10-50), StdDev (1-3)
  - MACD: Fast (5-20), Slow (20-40), Signal (5-15)
- [ ] Change colors
- [ ] Change line width
- [ ] Save preferences to localStorage

---

### 6. User Preferences

**Persistence:**
- [ ] Selected indicators saved per instrument
- [ ] Settings saved globally
- [ ] Restored on page load

**Default State:**
- [ ] No indicators enabled by default
- [ ] User must explicitly enable

---

## Technical Requirements

### Dependencies

**Install:**
```bash
npm install technicalindicators
npm install @types/technicalindicators --save-dev
```

---

### Indicator Service
**File**: `frontend/src/features/market/services/indicatorService.ts`

```tsx
import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';

export class IndicatorService {
  /**
   * Calculate Simple Moving Average
   * @param prices Array of closing prices (last 100 candles)
   * @param period SMA period (e.g., 20, 50, 200)
   * @returns Array of SMA values
   */
  static calculateSMA(prices: number[], period: number): number[] {
    if (prices.length < period) {
      console.warn(`Insufficient data for SMA(${period}). Need ${period}, have ${prices.length}`);
      return [];
    }
    
    return SMA.calculate({ period, values: prices });
  }

  /**
   * Calculate Exponential Moving Average
   */
  static calculateEMA(prices: number[], period: number): number[] {
    if (prices.length < period) return [];
    return EMA.calculate({ period, values: prices });
  }

  /**
   * Calculate RSI
   * @param prices Closing prices
   * @param period RSI period (default 14)
   * @returns Array of RSI values (0-100)
   */
  static calculateRSI(prices: number[], period: number = 14): number[] {
    if (prices.length < period + 1) return [];
    return RSI.calculate({ period, values: prices });
  }

  /**
   * Calculate MACD
   * @returns Array of {MACD, signal, histogram}
   */
  static calculateMACD(
    prices: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ) {
    if (prices.length < slowPeriod + signalPeriod) return [];
    
    return MACD.calculate({
      values: prices,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });
  }

  /**
   * Calculate Bollinger Bands
   * @returns Array of {upper, middle, lower, pb, bandwidth}
   */
  static calculateBollingerBands(
    prices: number[],
    period: number = 20,
    stdDev: number = 2
  ) {
    if (prices.length < period) return [];
    
    return BollingerBands.calculate({
      period,
      values: prices,
      stdDev
    });
  }

  /**
   * Calculate VWAP (Volume Weighted Average Price)
   * Requires high, low, close, volume
   */
  static calculateVWAP(candles: Array<{
    high: number;
    low: number;
    close: number;
    volume: number;
  }>): number[] {
    const vwap: number[] = [];
    let cumulativeTPV = 0; // Typical Price × Volume
    let cumulativeVolume = 0;
    
    candles.forEach(candle => {
      const typicalPrice = (candle.high + candle.low + candle.close) / 3;
      cumulativeTPV += typicalPrice * candle.volume;
      cumulativeVolume += candle.volume;
      
      vwap.push(cumulativeTPV / cumulativeVolume);
    });
    
    return vwap;
  }
}
```

---

### Indicator Store
**File**: `frontend/src/features/market/store/indicatorStore.ts`

```tsx
interface IndicatorConfig {
  enabled: boolean;
  settings: Record<string, any>;
  color?: string;
  lineWidth?: number;
}

interface IndicatorState {
  // Per-instrument indicator selections
  instrumentIndicators: Map<string, {
    sma: IndicatorConfig;
    ema: IndicatorConfig;
    rsi: IndicatorConfig;
    macd: IndicatorConfig;
    bollingerBands: IndicatorConfig;
    vwap: IndicatorConfig;
  }>;
  
  toggleIndicator: (instrumentId: string, indicator: string) => void;
  updateSettings: (instrumentId: string, indicator: string, settings: any) => void;
  
  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}
```

---

### Integration with StockChart

**Modify**: `frontend/src/features/market/components/StockChart.tsx`

```tsx
export const StockChart = ({ instrumentId, symbol }: StockChartProps) => {
  const chartRef = useRef<IChartApi>(null);
  const { candles } = useCandles(instrumentId);
  const { instrumentIndicators } = useIndicatorStore();
  
  const indicators = instrumentIndicators.get(instrumentId);
  
  // Calculate indicators
  const closePrices = useMemo(() => 
    candles.map(c => c.close), 
    [candles]
  );
  
  const smaData = useMemo(() => {
    if (!indicators?.sma.enabled) return null;
    const period = indicators.sma.settings.period || 20;
    return IndicatorService.calculateSMA(closePrices, period);
  }, [closePrices, indicators?.sma]);
  
  // Add SMA series to chart
  useEffect(() => {
    if (!chartRef.current || !smaData) return;
    
    const smaSeries = chartRef.current.addLineSeries({
      color: indicators.sma.color || '#2196F3',
      lineWidth: indicators.sma.lineWidth || 2,
      title: `SMA(${indicators.sma.settings.period})`
    });
    
    const smaPoints = smaData.map((value, index) => ({
      time: candles[index + (closePrices.length - smaData.length)].time,
      value
    }));
    
    smaSeries.setData(smaPoints);
    
    return () => {
      chartRef.current?.removeSeries(smaSeries);
    };
  }, [smaData, candles]);
  
  // Similar for other indicators...
};
```

---

### Indicator Panel Component
**File**: `frontend/src/features/market/components/IndicatorPanel.tsx`

```tsx
export const IndicatorPanel = ({ instrumentId }: { instrumentId: string }) => {
  const { instrumentIndicators, toggleIndicator } = useIndicatorStore();
  const indicators = instrumentIndicators.get(instrumentId);
  
  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="subtitle2" gutterBottom>
        Technical Indicators
      </Typography>
      
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators?.sma.enabled || false}
              onChange={() => toggleIndicator(instrumentId, 'sma')}
            />
          }
          label="SMA (20, 50, 200)"
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators?.ema.enabled || false}
              onChange={() => toggleIndicator(instrumentId, 'ema')}
            />
          }
          label="EMA (9, 21, 50)"
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators?.rsi.enabled || false}
              onChange={() => toggleIndicator(instrumentId, 'rsi')}
            />
          }
          label="RSI (14)"
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators?.macd.enabled || false}
              onChange={() => toggleIndicator(instrumentId, 'macd')}
            />
          }
          label="MACD (12, 26, 9)"
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators?.bollingerBands.enabled || false}
              onChange={() => toggleIndicator(instrumentId, 'bollingerBands')}
            />
          }
          label="Bollinger Bands (20, 2)"
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators?.vwap.enabled || false}
              onChange={() => toggleIndicator(instrumentId, 'vwap')}
            />
          }
          label="VWAP"
        />
      </FormGroup>
    </Box>
  );
};
```

---

## Data Limitation Handling

**100 Candle Constraint:**

```tsx
// Warning for indicators requiring more data
const getDataSufficiencyWarning = (indicator: string, period: number, available: number) => {
  if (available < period) {
    return `⚠️ ${indicator}(${period}) requires ${period} candles, only ${available} available. Results may be incomplete.`;
  }
  return null;
};

// Example usage
if (closePrices.length < 200) {
  console.warn(getDataSufficiencyWarning('SMA', 200, closePrices.length));
  // Still calculate with available data
  // SMA(200) will only have values for last (100 - 200) = 0 points
  // So effectively won't show for SMA(200) with only 100 candles
}
```

**Recommendation:**
- Show indicators that work with 100 candles:
  - ✅ SMA(20), SMA(50) - Work fine
  - ⚠️ SMA(200) - Won't show (needs 200 candles)
  - ✅ EMA(9), EMA(21), EMA(50) - Work fine
  - ✅ RSI(14) - Works fine
  - ✅ MACD(12,26,9) - Works fine (needs ~35 candles)
  - ✅ Bollinger Bands(20,2) - Works fine

---

## Implementation Steps

### Phase 1: Setup (1 hour)
1. Install `technicalindicators` library
2. Create IndicatorService
3. Create IndicatorStore
4. Add tests for calculations

### Phase 2: Overlay Indicators (2 hours)
1. Implement SMA overlay
2. Implement EMA overlay
3. Implement Bollinger Bands
4. Implement VWAP

### Phase 3: Sub-Chart Indicators (2 hours)
1. Create sub-chart container
2. Implement RSI panel
3. Implement MACD panel
4. Add zoom/pan sync

### Phase 4: UI & Preferences (1 hour)
1. Create IndicatorPanel component
2. Add settings dialog
3. Implement localStorage persistence
4. Add to InstrumentDetail page

**Total: 6 hours**

---

## Success Metrics

- [ ] All 6 indicators calculate correctly
- [ ] Indicators update in real-time with new candles
- [ ] No performance lag (< 100ms calculation time)
- [ ] User preferences persist
- [ ] Works with 100-candle limitation

---

## Dependencies

**Required:**
- ✅ US-2.3.1: Live Stock Charts (candle data)
- ✅ US-2.2.1: Market Data Feed (real-time updates)

---

## Future Enhancements

1. **More Indicators**: Stochastic, ATR, OBV, ADX
2. **Custom Indicators**: User-defined formulas
3. **Indicator Alerts**: Notify when RSI > 70, etc.
4. **Backtesting**: Test strategies with indicators
5. **Cloud Sync**: Save preferences across devices
