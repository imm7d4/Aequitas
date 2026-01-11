# Technical Indicators Glossary

This document provides a comprehensive reference for the technical indicators implemented in the Aequitas platform's `IndicatorService` (`frontend/src/features/market/services/indicatorService.ts`). It covers definitions, mathematical formulas, implementation details, and practical usage examples.

## 1. Simple Moving Average (SMA)

### Definition
The Simple Moving Average (SMA) is the unweighted mean of the previous $n$ data points. It is the most basic trend-following indicator, smoothing out price data to identify the direction of the trend.

### Aequitas Implementation
- **Library**: `technicalindicators`
- **Method**: `IndicatorService.calculateSMA(prices, period)`
- **Default Params**: User-configurable (typically 20, 50, 200).

### Mathematical Logic
$$SMA_k = \frac{p_{k} + p_{k-1} + ... + p_{k-n+1}}{n}$$

Where:
- $p_k$: Closing price at time $k$
- $n$: Period

### Deep Example
**Scenario**: Calculating a 5-day SMA.
**Prices**: `[10, 11, 12, 13, 14, 15]`

1.  **Day 5 SMA**: $(10+11+12+13+14) / 5 = 60 / 5 = 12$
2.  **Day 6 SMA**: $(11+12+13+14+15) / 5 = 65 / 5 = 13$

**Interpretation**:
- If Price > SMA, the trend is generally **UP**.
- If Price < SMA, the trend is generally **DOWN**.
- **Golden Cross**: When a short-term SMA (e.g., 50) crosses above a long-term SMA (e.g., 200) -> **Bullish Signal**.
- **Death Cross**: When a short-term SMA crosses below a long-term SMA -> **Bearish Signal**.

---

## 2. Exponential Moving Average (EMA)

### Definition
The Exponential Moving Average (EMA) places a greater weight and significance on the most recent data points. It reacts more significantly and quickly to price changes than the SMA.

### Aequitas Implementation
- **Library**: `technicalindicators`
- **Method**: `IndicatorService.calculateEMA(prices, period)`
- **Default Params**: User-configurable (typically 9, 21, 50).

### Mathematical Logic
$$EMA_k = (p_k - EMA_{k-1}) \times M + EMA_{k-1}$$

Where:
- $M$ (Multiplier) = $2 / (n + 1)$
- $p_k$: Current Closing Price
- $EMA_{k-1}$: Previous EMA value (SMA is used for the first calculation)

### Deep Example
**Scenario**: Calculating a 10-day EMA. $M = 2/(10+1) = 0.1818$.
**Previous EMA**: 100
**Current Price**: 110

$$EMA = (110 - 100) \times 0.1818 + 100$$
$$EMA = 10 \times 0.1818 + 100 = 101.818$$

**Interpretation**:
- **Responsiveness**: Use EMA for short-term trading signals as it reduces lag compared to SMA.
- **Support/Resistance**: Dynamic support levels in trends often align with key EMAs (e.g., 21 EMA).

---

## 3. Relative Strength Index (RSI)

### Definition
RSI is a momentum oscillator that measures the speed and change of price movements. It oscillates between zero and 100.

### Aequitas Implementation
- **Library**: `technicalindicators`
- **Method**: `IndicatorService.calculateRSI(prices, period)`
- **Default Params**: Period = 14.

### Mathematical Logic
$$RSI = 100 - \frac{100}{1 + RS}$$

$$RS = \frac{\text{Average Gain}}{\text{Average Loss}}$$

**Average Gain/Loss calculation (Wilder's Smoothing)**:
$$AvgGain_k = \frac{(AvgGain_{k-1} \times (n-1)) + Gain_k}{n}$$

### Deep Example
**Scenario**: 14-period RSI.
**Average Gain**: 5
**Average Loss**: 2

$$RS = 5 / 2 = 2.5$$
$$RSI = 100 - (100 / (1 + 2.5))$$
$$RSI = 100 - (100 / 3.5) = 100 - 28.57 = 71.43$$

**Interpretation**:
- **Overbought**: RSI > 70. Suggests the asset may be overvalued and due for a pullback.
- **Oversold**: RSI < 30. Suggests the asset may be undervalued and due for a bounce.
- **Divergence**: If Price makes a higher high but RSI makes a lower high, it signals weakening momentum (**Bearish Divergence**).

---

## 4. Moving Average Convergence Divergence (MACD)

### Definition
MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.

### Aequitas Implementation
- **Library**: `technicalindicators`
- **Method**: `IndicatorService.calculateMACD(prices, fast, slow, signal)`
- **Default Params**: Fast=12, Slow=26, Signal=9.
- **Returns**: `{ MACD, signal, histogram }`

### Mathematical Logic
1.  **MACD Line**: $EMA_{12}(Price) - EMA_{26}(Price)$
2.  **Signal Line**: $EMA_9(MACD Line)$
3.  **Histogram**: $MACD Line - Signal Line$

### Deep Example
**Scenario**:
- 12-Day EMA: 115
- 26-Day EMA: 110
- Previous MACD Signal (9-day EMA of MACD): 4.5

1.  **MACD Line**: $115 - 110 = 5.0$
2.  **Signal update**: (Assume simple math for example) Let's say new Signal is 4.6.
3.  **Histogram**: $5.0 - 4.6 = 0.4$

**Interpretation**:
- **Crossover**:
    - MACD crosses **above** Signal Line: **Bullish** (Buy).
    - MACD crosses **below** Signal Line: **Bearish** (Sell).
- **Histogram**: Represents the strength of the move. Widening histogram bars indicate strengthening momentum.

---

## 5. Bollinger Bands

### Definition
Bollinger Bands are a volatility indicator consisting of a middle band (SMA) and two outer bands (standard deviations away from the middle).

### Aequitas Implementation
- **Library**: `technicalindicators`
- **Method**: `IndicatorService.calculateBollingerBands(prices, period, stdDev)`
- **Default Params**: Period=20, StdDev=2.
- **Returns**: `{ upper, middle, lower, pb }` (pb = %B)

### Mathematical Logic
1.  **Middle Band**: $SMA_{20}$
2.  **Upper Band**: $SMA_{20} + (2 \times \sigma_{20})$
3.  **Lower Band**: $SMA_{20} - (2 \times \sigma_{20})$
4.  **%B (Percent Bandwidth)**: $(Price - Lower) / (Upper - Lower)$

*Assuming $\sigma$ is standard deviation.*

### Deep Example
**Scenario**:
- SMA (Middle): 100
- Standard Deviation ($\sigma$): 5

1.  **Upper**: $100 + (2 \times 5) = 110$
2.  **Lower**: $100 - (2 \times 5) = 90$

**Interpretation**:
- **Squeeze**: When bands contract (low volatility), a sharp price move (breakout) often follows.
- **Trend**:
    - "Walking the bands": In a strong uptrend, price often hugs the upper band.
- **Reversion**: Prices touching the outer bands often revert to the mean (Middle Band).

---

## 6. Volume Weighted Average Price (VWAP)

### Definition
VWAP is a trading benchmark used by traders that gives the average price a security has traded at throughout the day, based on both volume and price. It provides insight into the trend and value of a security.

### Aequitas Implementation
- **Library**: Custom Implementation (in `IndicatorService.calculateVWAP`)
- **Method**: Cumulative calculation over the provided candle set.
- **Reset**: Typically resets at the start of each trading day (Intraday indicator), though our service calculates it for the provided dataset window.

### Mathematical Logic
$$VWAP = \frac{\sum (Typical Price \times Volume)}{\sum Volume}$$

Where:
- $Typical Price = \frac{High + Low + Close}{3}$

### Deep Example
**Candle 1**: High 102, Low 98, Close 101, Volume 1000.
**Candle 2**: High 105, Low 101, Close 104, Volume 2000.

1.  **Candle 1**:
    - TP: $(102+98+101)/3 = 100.33$
    - TP x Vol: $100.33 \times 1000 = 100,333$
    - Cum Vol: 1000
    - **VWAP**: $100,333 / 1000 = 100.33$

2.  **Candle 2**:
    - TP: $(105+101+104)/3 = 103.33$
    - TP x Vol: $103.33 \times 2000 = 206,666$
    - **Cumulative TP x Vol**: $100,333 + 206,666 = 306,999$
    - **Cumulative Vol**: $1000 + 2000 = 3000$
    - **VWAP**: $306,999 / 3000 = 102.33$

**Interpretation**:
- **Institutions**: Often used to gauge execution quality. Buy < VWAP is good; Buy > VWAP is bad.
- **Trend Filter**:
    - Price > VWAP: **Bullish** Intraday Trend.
    - Price < VWAP: **Bearish** Intraday Trend.
