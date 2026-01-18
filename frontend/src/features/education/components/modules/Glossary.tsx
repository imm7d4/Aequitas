import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';
import './ModuleStyles.css';

interface GlossaryTerm {
    id: string;
    term: string;
    category: string;
    definition: string;
    formula?: string;
    example?: string;
}

const GLOSSARY_DATA: GlossaryTerm[] = [
    // Market Basics
    { id: '1', term: 'Instrument', category: 'Market Basics', definition: 'A tradable financial asset. In equity markets, this refers to stocks or shares of publicly traded companies.', example: 'RELIANCE, TCS, INFY are instruments available for trading.' },
    { id: '2', term: 'Symbol / Ticker', category: 'Market Basics', definition: 'A short alphabetic code used to uniquely identify a publicly traded company\'s stock.', example: 'RELIANCE for Reliance Industries, TCS for Tata Consultancy Services.' },
    { id: '3', term: 'ISIN', category: 'Market Basics', definition: 'International Securities Identification Number - a 12-character alphanumeric code that uniquely identifies a specific security globally.', example: 'INE002A01018 for Reliance Industries.' },
    { id: '4', term: 'NSE (National Stock Exchange)', category: 'Market Basics', definition: 'India\'s largest stock exchange by market capitalization and trading volume. Founded in 1992, it introduced electronic trading to India.', example: 'Trading hours: 9:15 AM - 3:30 PM IST. Home to NIFTY 50 index.' },
    { id: '5', term: 'BSE (Bombay Stock Exchange)', category: 'Market Basics', definition: 'Asia\'s oldest stock exchange, established in 1875. Located in Mumbai, it is home to the SENSEX index.', example: 'Over 5,000 listed companies. Known for the iconic BSE building at Dalal Street.' },
    { id: '6', term: 'NIFTY 50', category: 'Market Basics', definition: 'The flagship index of NSE representing the weighted average of 50 of the largest Indian companies across 13 sectors. Used as a benchmark for the Indian equity market.', example: 'Includes companies like Reliance, TCS, HDFC Bank, Infosys. Base year: 1995, Base value: 1000.' },
    { id: '7', term: 'SENSEX', category: 'Market Basics', definition: 'The BSE Sensitive Index, comprising 30 of the largest and most actively traded stocks on BSE. India\'s oldest stock market index.', example: 'Launched in 1986. Base year: 1978-79, Base value: 100. Tracks blue-chip companies.' },
    { id: '8', term: 'NASDAQ', category: 'Market Basics', definition: 'National Association of Securities Dealers Automated Quotations - the world\'s first electronic stock exchange. Known for technology and growth stocks.', example: 'Home to Apple, Microsoft, Amazon, Google. Second-largest exchange globally by market cap.' },
    { id: '9', term: 'LTP (Last Traded Price)', category: 'Market Basics', definition: 'The price at which the most recent trade was executed. This is the "headline" price shown on dashboards. Note: LTP is historical data and doesn\'t guarantee you can buy/sell at this price immediately.' },
    { id: '10', term: 'Bid Price', category: 'Market Basics', definition: 'The highest price a buyer is willing to pay for a security at a given moment.', example: 'If the highest bid is ₹1,500, buyers are willing to purchase at that price.' },
    { id: '11', term: 'Ask Price', category: 'Market Basics', definition: 'The lowest price a seller is willing to accept for a security.', example: 'If the lowest ask is ₹1,505, sellers want at least that price.' },
    { id: '12', term: 'Spread', category: 'Market Basics', definition: 'The difference between the highest bid price and the lowest ask price.', formula: 'Spread = Ask Price - Bid Price', example: 'Bid ₹1,500, Ask ₹1,505 → Spread = ₹5' },
    { id: '13', term: 'Market Depth', category: 'Market Basics', definition: 'A real-time list of all pending buy and sell orders for a security, showing the quantity available at each price level.' },
    { id: '14', term: 'Tick Size', category: 'Market Basics', definition: 'The minimum price movement a trading instrument can make.', example: 'For most NSE stocks, tick size is ₹0.05.' },
    { id: '15', term: 'Lot Size', category: 'Market Basics', definition: 'The minimum quantity of shares that can be traded in a single transaction.', example: 'If lot size is 1, you can trade any quantity. Some derivatives have lot sizes of 50 or 100.' },
    { id: '16', term: 'Volume', category: 'Market Basics', definition: 'The total number of shares traded during a specific time period. High volume indicates strong interest and liquidity.' },
    { id: '17', term: 'Liquidity', category: 'Market Basics', definition: 'The ease with which an asset can be bought or sold without significantly affecting its price.', example: 'High Liquidity: Large-cap stocks like RELIANCE. Low Liquidity: Small-cap or penny stocks.' },

    // Order Types & Execution
    { id: '13', term: 'Market Order', category: 'Order Types & Execution', definition: 'An order to buy or sell immediately at the best available current price. Priority: Speed > Price. Risk: Slippage (price may change between order placement and execution).' },
    { id: '14', term: 'Limit Order', category: 'Order Types & Execution', definition: 'An order to buy or sell at a specific price or better. Priority: Price > Time. Risk: Order may never execute if market doesn\'t reach your price.' },
    { id: '15', term: 'Stop Loss Order', category: 'Order Types & Execution', definition: 'A defensive order that triggers a market or limit order when the price hits a specified threshold.', example: 'Buy at ₹1,000, set stop loss at ₹950 to limit loss to ₹50 per share.' },
    { id: '16', term: 'Stop Limit Order', category: 'Order Types & Execution', definition: 'A stop order that becomes a limit order (instead of market order) when triggered. Advantage: Price control after trigger. Risk: May not execute if price moves too quickly.' },
    { id: '17', term: 'Trailing Stop Order', category: 'Order Types & Execution', definition: 'A dynamic stop order where the stop price "trails" the market price by a specified amount or percentage. Purpose: Lock in profits while giving the trade room to grow.' },
    { id: '18', term: 'Time in Force', category: 'Order Types & Execution', definition: 'Specifies how long an order remains active. Types: Day Order (valid until market close), IOC (Immediate or Cancel), GTC (Good Till Cancelled).' },
    { id: '19', term: 'Fill', category: 'Order Types & Execution', definition: 'The completion of an order. When your order is matched with a counterparty.' },
    { id: '20', term: 'Partial Fill', category: 'Order Types & Execution', definition: 'When only part of your order quantity is executed.', example: 'Order 100 shares, only 60 are filled immediately.' },
    { id: '21', term: 'Execution', category: 'Order Types & Execution', definition: 'The actual trade event where buyer and seller are matched at an agreed price.' },
    { id: '22', term: 'Slippage', category: 'Order Types & Execution', definition: 'The difference between the expected price of a trade and the actual execution price. Common with market orders during volatile conditions.' },
    { id: '23', term: 'Order Status', category: 'Order Types & Execution', definition: 'The current state of an order in its lifecycle: NEW (just placed), PENDING (waiting for match), FILLED (executed), CANCELLED (user cancelled), REJECTED (failed validation).' },
    { id: '24', term: 'IOC (Immediate or Cancel)', category: 'Order Types & Execution', definition: 'An order validity type that executes immediately at the specified price or better. Any unfilled portion is automatically cancelled.', example: 'Useful for traders who want to avoid leaving orders on the book.' },
    { id: '25', term: 'GTC (Good Till Cancelled)', category: 'Order Types & Execution', definition: 'An order that remains active until it is filled or manually cancelled by the trader. Not available for market orders.' },
    { id: '26', term: 'Day Order', category: 'Order Types & Execution', definition: 'An order that remains active only for the current trading session. Automatically cancelled at market close if not filled.' },

    // Technical Indicators
    { id: '27', term: 'SMA (Simple Moving Average)', category: 'Technical Indicators', definition: 'The arithmetic mean of prices over a specified number of periods.', formula: 'SMA = (P1 + P2 + ... + Pn) / n' },
    { id: '28', term: 'EMA (Exponential Moving Average)', category: 'Technical Indicators', definition: 'A moving average that gives more weight to recent prices. Advantage: Reacts faster to price changes than SMA.', formula: 'EMA = (Price - Previous EMA) × Multiplier + Previous EMA, where Multiplier = 2/(Period + 1)' },
    { id: '29', term: 'Golden Cross', category: 'Technical Indicators', definition: 'A bullish signal when a short-term moving average crosses above a long-term moving average.', example: '50-day SMA crosses above 200-day SMA.' },
    { id: '30', term: 'Death Cross', category: 'Technical Indicators', definition: 'A bearish signal when a short-term moving average crosses below a long-term moving average.' },
    { id: '31', term: 'RSI (Relative Strength Index)', category: 'Technical Indicators', definition: 'A momentum oscillator measuring the speed and magnitude of price movements on a scale of 0-100. > 70: Overbought (potential pullback). < 30: Oversold (potential bounce).', formula: 'RSI = 100 - (100 / (1 + RS)), where RS = Average Gain / Average Loss' },
    { id: '32', term: 'Overbought', category: 'Technical Indicators', definition: 'A condition where an asset has risen too far, too fast, and may be due for a price correction.' },
    { id: '33', term: 'Oversold', category: 'Technical Indicators', definition: 'A condition where an asset has fallen too far, too fast, and may be due for a price bounce.' },
    { id: '34', term: 'MACD', category: 'Technical Indicators', definition: 'Moving Average Convergence Divergence - a trend-following momentum indicator showing the relationship between two moving averages. Components: MACD Line (12-day EMA - 26-day EMA), Signal Line (9-day EMA of MACD), Histogram (MACD - Signal).' },
    { id: '35', term: 'MACD Histogram', category: 'Technical Indicators', definition: 'The difference between the MACD line and signal line. Widening histogram bars indicate strengthening momentum, narrowing bars indicate weakening momentum.' },
    { id: '36', term: 'Divergence', category: 'Technical Indicators', definition: 'When price movement and indicator movement move in opposite directions.', example: 'Bearish Divergence: Price makes higher high, indicator makes lower high (weakening momentum).' },
    { id: '37', term: 'Convergence', category: 'Technical Indicators', definition: 'When the gap between two moving averages narrows, indicating weakening trend momentum.' },
    { id: '38', term: 'Bollinger Bands', category: 'Technical Indicators', definition: 'A volatility indicator consisting of a middle band (SMA) and two outer bands (standard deviations). Upper Band: SMA + (2 × SD), Middle: 20-period SMA, Lower: SMA - (2 × SD).' },
    { id: '39', term: 'Bollinger Squeeze', category: 'Technical Indicators', definition: 'When Bollinger Bands contract (low volatility), often preceding a sharp price move.' },
    { id: '40', term: '%B (Percent Bandwidth)', category: 'Technical Indicators', definition: 'A Bollinger Bands indicator showing where price is relative to the bands.', formula: '%B = (Price - Lower Band) / (Upper Band - Lower Band). Values > 1: Above upper band. Values < 0: Below lower band.' },
    { id: '41', term: 'VWAP', category: 'Technical Indicators', definition: 'Volume Weighted Average Price - the average price weighted by volume, showing the true average price paid during the day. Institutional benchmark for execution quality.', formula: 'VWAP = Σ(Typical Price × Volume) / Σ(Volume), where Typical Price = (High + Low + Close) / 3' },
    { id: '42', term: 'Support Level', category: 'Technical Indicators', definition: 'A price level where buying interest is strong enough to prevent further decline.' },
    { id: '43', term: 'Resistance Level', category: 'Technical Indicators', definition: 'A price level where selling pressure is strong enough to prevent further rise.' },
    { id: '44', term: 'Breakout', category: 'Technical Indicators', definition: 'When price moves above resistance or below support, often signaling a new trend.' },
    { id: '45', term: 'Typical Price', category: 'Technical Indicators', definition: 'The average of high, low, and close prices for a given period.', formula: 'Typical Price = (High + Low + Close) / 3. Used in VWAP calculations.' },

    // Portfolio & Position Management
    { id: '46', term: 'Position', category: 'Portfolio & Position Management', definition: 'The amount of a security you own (long) or owe (short).' },
    { id: '47', term: 'Long Position', category: 'Portfolio & Position Management', definition: 'Owning shares with the expectation that price will rise. Profit when price increases.' },
    { id: '48', term: 'Short Position', category: 'Portfolio & Position Management', definition: 'Selling borrowed shares with the expectation that price will fall. Profit when price decreases. Risk: Unlimited loss potential.' },
    { id: '49', term: 'Holding', category: 'Portfolio & Position Management', definition: 'A security currently owned in your portfolio.' },
    { id: '50', term: 'Average Entry Price', category: 'Portfolio & Position Management', definition: 'The weighted average price paid for all shares of a position.', formula: 'Avg Price = Total Cost / Total Quantity' },
    { id: '51', term: 'Cost Basis', category: 'Portfolio & Position Management', definition: 'The original value of an asset for tax purposes, typically the purchase price plus fees.' },
    { id: '52', term: 'Current Value', category: 'Portfolio & Position Management', definition: 'The market value of a position based on current market price.', formula: 'Current Value = Quantity × Current Price' },
    { id: '53', term: 'Unrealized P&L', category: 'Portfolio & Position Management', definition: 'Profit or loss on open positions based on current market price. Also called "paper profit/loss".', formula: 'Long: (Current Price - Avg Entry Price) × Quantity. Short: (Avg Entry Price - Current Price) × Quantity' },
    { id: '54', term: 'Realized P&L', category: 'Portfolio & Position Management', definition: 'Actual profit or loss locked in after closing a position.' },
    { id: '55', term: 'Net Worth', category: 'Portfolio & Position Management', definition: 'Total value of your account including cash and holdings.', formula: 'Net Worth = Cash + Long Holdings Value - Short Liabilities' },
    { id: '56', term: 'Free Cash', category: 'Portfolio & Position Management', definition: 'Cash available for withdrawal or new trades.', formula: 'Free Cash = Balance - Blocked Margin - Settlement Pending' },
    { id: '57', term: 'Blocked Margin', category: 'Portfolio & Position Management', definition: 'Funds locked as collateral for open positions (especially short positions).' },
    { id: '58', term: 'Portfolio Diversification', category: 'Portfolio & Position Management', definition: 'Spreading investments across different securities to reduce risk.' },
    { id: '59', term: 'Portfolio Snapshot', category: 'Portfolio & Position Management', definition: 'A point-in-time record of portfolio state including holdings, equity, and P&L. Used for historical analysis and margin monitoring.' },

    // Risk Management
    { id: '60', term: 'Margin', category: 'Risk Management', definition: 'Collateral required to open and maintain leveraged positions.' },
    { id: '61', term: 'Initial Margin', category: 'Risk Management', definition: 'The upfront collateral required to open a position.', example: '20% of position value for short selling in Aequitas.' },
    { id: '62', term: 'Maintenance Margin', category: 'Risk Management', definition: 'The minimum equity required to keep a position open.' },
    { id: '63', term: 'Margin Call', category: 'Risk Management', definition: 'A demand to deposit additional funds when equity falls below maintenance margin. In Aequitas, warnings are sent when equity < blocked margin.' },
    { id: '64', term: 'Mark-to-Market (MTM)', category: 'Risk Management', definition: 'Daily revaluation of positions at current market prices. In Aequitas, this happens every 3 minutes for margin monitoring.' },
    { id: '65', term: 'Leverage', category: 'Risk Management', definition: 'Using borrowed capital to increase position size and potential returns. Risk: Amplifies both gains and losses.', example: 'With 5x leverage, a 10% price move results in a 50% portfolio change.' },
    { id: '66', term: 'Risk-Reward Ratio', category: 'Risk Management', definition: 'The ratio of potential profit to potential loss on a trade.', example: 'Risk ₹100 to make ₹300 = 1:3 ratio' },
    { id: '67', term: 'Position Sizing', category: 'Risk Management', definition: 'Determining how many shares to buy based on risk tolerance and account size.' },
    { id: '68', term: 'Drawdown', category: 'Risk Management', definition: 'The peak-to-trough decline in account value during a specific period.', example: 'Account drops from ₹1,00,000 to ₹85,000 = 15% drawdown' },
    { id: '69', term: 'Volatility', category: 'Risk Management', definition: 'The degree of price variation over time. Higher volatility = higher risk and opportunity.' },
    { id: '70', term: 'Beta', category: 'Risk Management', definition: 'A measure of a stock\'s volatility relative to the overall market. Beta > 1: More volatile than market. Beta < 1: Less volatile than market.' },
    { id: '71', term: 'Equity Ratio', category: 'Risk Management', definition: 'The ratio of total equity to blocked margin. Used in Aequitas for margin monitoring.', formula: 'Equity Ratio = Total Equity / Blocked Margin. < 1.0: Warning. < 0.5: Critical.' },

    // Market Microstructure
    { id: '72', term: 'Matching Engine', category: 'Market Microstructure', definition: 'The system that pairs buy and sell orders based on price-time priority. In Aequitas, runs every 3 seconds.' },
    { id: '73', term: 'Price-Time Priority', category: 'Market Microstructure', definition: 'The rule that better prices get matched first, and at the same price, earlier orders get priority.' },
    { id: '74', term: 'CLOB', category: 'Market Microstructure', definition: 'Central Limit Order Book - a trading system where all buy and sell orders are collected and matched centrally.' },
    { id: '75', term: 'Market Maker', category: 'Market Microstructure', definition: 'An entity that provides liquidity by continuously quoting both buy and sell prices.' },
    { id: '76', term: 'Liquidity Provider', category: 'Market Microstructure', definition: 'Traders or institutions that add depth to the order book by placing limit orders.' },
    { id: '77', term: 'Liquidity Taker', category: 'Market Microstructure', definition: 'Traders who remove liquidity by placing market orders that execute immediately.' },
    { id: '78', term: 'OHLC', category: 'Market Microstructure', definition: 'Open, High, Low, Close - standard price summary for a time period, used in candlestick charts.' },
    { id: '79', term: 'Candlestick Chart', category: 'Market Microstructure', definition: 'A price chart showing open, high, low, and close for each time period. Green/White: Close > Open (bullish). Red/Black: Close < Open (bearish).' },
    { id: '80', term: 'Market Hours', category: 'Market Microstructure', definition: 'The time period when the exchange is open for trading.', example: 'NSE: 9:15 AM - 3:30 PM IST' },
    { id: '81', term: 'Order Book', category: 'Market Microstructure', definition: 'A real-time electronic list of buy and sell orders organized by price level. Shows market depth and liquidity at each price point.' },
    { id: '82', term: 'Atomic Matching', category: 'Market Microstructure', definition: 'In Aequitas, the matching engine processes all orders in a single atomic transaction per cycle, ensuring consistency and preventing race conditions.' },

    // Trading Metrics & Analytics
    { id: '83', term: 'MAE', category: 'Trading Metrics & Analytics', definition: 'Max Adverse Excursion - the maximum unrealized loss experienced during a trade. Insight: "How much did I have to sweat?" Calculated using 1-minute OHLC data in Aequitas.' },
    { id: '84', term: 'MFE', category: 'Trading Metrics & Analytics', definition: 'Max Favorable Excursion - the maximum unrealized profit available during a trade. Insight: "What was the potential?" Shows the best exit opportunity you had.' },
    { id: '85', term: 'Opportunity Cost', category: 'Trading Metrics & Analytics', definition: 'The profit "left on the table" by not exiting at the optimal price.', formula: '|MFE - Actual Profit Per Share|. High opportunity cost indicates poor exit timing.' },
    { id: '86', term: 'Win Rate', category: 'Trading Metrics & Analytics', definition: 'Percentage of profitable trades out of total trades.', formula: '(Winning Trades / Total Trades) × 100' },
    { id: '87', term: 'Profit Factor', category: 'Trading Metrics & Analytics', definition: 'Ratio of gross profit to gross loss.', formula: 'Total Profit / Total Loss. > 1: Profitable strategy. < 1: Losing strategy.' },
    { id: '88', term: 'Sharpe Ratio', category: 'Trading Metrics & Analytics', definition: 'Risk-adjusted return metric comparing excess return to volatility. Higher is better: More return per unit of risk.' },
    { id: '89', term: 'Trade Duration', category: 'Trading Metrics & Analytics', definition: 'The time elapsed between opening and closing a position.' },
    { id: '90', term: 'Round Trip', category: 'Trading Metrics & Analytics', definition: 'A complete trade cycle: opening and closing a position. In Aequitas, used as the unit for trade diagnostics analysis.' },
    { id: '91', term: 'FIFO Matching', category: 'Trading Metrics & Analytics', definition: 'First-In-First-Out - the method used in Aequitas to pair entry and exit orders for trade diagnostics. Ensures accurate P&L calculation for partial positions.' },
    { id: '92', term: 'Gross P&L', category: 'Trading Metrics & Analytics', definition: 'Profit or loss before deducting fees and commissions.', formula: '(Exit Price - Entry Price) × Quantity for longs' },
    { id: '93', term: 'Net P&L', category: 'Trading Metrics & Analytics', definition: 'Profit or loss after deducting all fees and commissions. The actual money gained or lost.', formula: 'Gross P&L - Total Commissions' },
    { id: '94', term: 'Fee Fragmentation', category: 'Trading Metrics & Analytics', definition: 'The hidden cost of splitting trades across multiple orders. Each order incurs minimum commission (₹20 in Aequitas), so 3 orders cost ₹60 vs ₹20 for a single order.' },

    // Advanced Concepts
    { id: '95', term: 'Arbitrage', category: 'Advanced Concepts', definition: 'Simultaneously buying and selling the same asset in different markets to profit from price differences.' },
    { id: '96', term: 'Hedging', category: 'Advanced Concepts', definition: 'Taking an offsetting position to reduce risk exposure.', example: 'Buying puts to protect a long stock position.' },
    { id: '97', term: 'Scalping', category: 'Advanced Concepts', definition: 'A trading strategy involving many small profits from minor price changes. Holding Period: Seconds to minutes.' },
    { id: '98', term: 'Day Trading', category: 'Advanced Concepts', definition: 'Buying and selling securities within the same trading day. Rule: All positions closed before market close.' },
    { id: '99', term: 'Swing Trading', category: 'Advanced Concepts', definition: 'Holding positions for several days to weeks to profit from price swings.' },
    { id: '100', term: 'Intraday', category: 'Advanced Concepts', definition: 'Refers to trading activity within a single day.' },
    { id: '101', term: 'Settlement', category: 'Advanced Concepts', definition: 'The process of transferring securities and cash to complete a trade. T+1: Settlement occurs one business day after trade. T+2: Two business days after trade.' },
    { id: '102', term: 'Corporate Action', category: 'Advanced Concepts', definition: 'Events initiated by a company that affect shareholders. Examples: Dividends, stock splits, mergers, bonus issues.' },
    { id: '103', term: 'Dividend', category: 'Advanced Concepts', definition: 'A portion of company profits distributed to shareholders. Types: Cash Dividend (paid in cash), Stock Dividend (paid in additional shares).' },
    { id: '104', term: 'Stock Split', category: 'Advanced Concepts', definition: 'Dividing existing shares into multiple shares to reduce share price.', example: '1:2 split → 1 share at ₹1,000 becomes 2 shares at ₹500 each.' },
    { id: '105', term: 'Bonus Issue', category: 'Advanced Concepts', definition: 'Free additional shares given to existing shareholders.', example: '1:1 bonus → You get 1 free share for every share owned.' },
    { id: '106', term: 'Market Capitalization', category: 'Advanced Concepts', definition: 'Total market value of a company\'s outstanding shares.', formula: 'Market Cap = Share Price × Total Shares Outstanding. Large Cap: > ₹20,000 Cr. Mid Cap: ₹5,000-20,000 Cr. Small Cap: < ₹5,000 Cr.' },
    { id: '107', term: 'Blue Chip Stocks', category: 'Advanced Concepts', definition: 'Shares of large, well-established, financially sound companies with a history of reliable performance.', example: 'RELIANCE, TCS, HDFC Bank.' },
    { id: '108', term: 'Penny Stocks', category: 'Advanced Concepts', definition: 'Low-priced stocks (typically under ₹10) with high volatility and risk.' },
    { id: '109', term: 'Circuit Breaker', category: 'Advanced Concepts', definition: 'Trading halt triggered when a stock or index moves beyond a predetermined percentage. Purpose: Prevent panic selling or excessive speculation.' },
    { id: '110', term: 'Upper Circuit', category: 'Advanced Concepts', definition: 'Maximum price increase allowed in a single day (typically 5%, 10%, or 20%).' },
    { id: '111', term: 'Lower Circuit', category: 'Advanced Concepts', definition: 'Maximum price decrease allowed in a single day.' },
    { id: '112', term: 'Sector', category: 'Advanced Concepts', definition: 'A group of companies in the same industry.', example: 'Banking, IT, Pharma, Auto.' },

    // Aequitas Platform Specific
    { id: '113', term: 'Intent', category: 'Aequitas Platform', definition: 'In Aequitas, the trading purpose behind an order: OPEN_LONG (buy to open), CLOSE_LONG (sell to close), OPEN_SHORT (sell to open short), CLOSE_SHORT (buy to cover). Critical for proper position management.' },
    { id: '114', term: 'OPEN_LONG', category: 'Aequitas Platform', definition: 'An intent indicating a BUY order to open a new long position or add to an existing long position.' },
    { id: '115', term: 'CLOSE_LONG', category: 'Aequitas Platform', definition: 'An intent indicating a SELL order to close or reduce a long position.' },
    { id: '116', term: 'OPEN_SHORT', category: 'Aequitas Platform', definition: 'An intent indicating a SELL order to open a new short position or add to an existing short position. Requires margin and shortable instrument.' },
    { id: '117', term: 'CLOSE_SHORT', category: 'Aequitas Platform', definition: 'An intent indicating a BUY order to cover (close) a short position. Also called "covering" or "squaring off".' },
    { id: '118', term: 'Cover / Square Off', category: 'Aequitas Platform', definition: 'Closing a short position by buying back the borrowed shares. In Aequitas, use CLOSE_SHORT intent.' },
    { id: '119', term: '3-Second Heartbeat', category: 'Aequitas Platform', definition: 'The core timing mechanism in Aequitas. The matching engine, stop order monitor, and market data updates all run on 3-second cycles.' },
    { id: '120', term: 'Pending Quantity Check', category: 'Aequitas Platform', definition: 'A validation in Aequitas that prevents over-committing positions by checking total quantity in active orders before accepting new orders.' },
    { id: '121', term: 'Trade Result', category: 'Aequitas Platform', definition: 'An immutable record in Aequitas representing a completed round-trip trade with all diagnostic metrics (MAE, MFE, P&L, duration, etc.).' },
    { id: '122', term: 'Active Trade Unit', category: 'Aequitas Platform', definition: 'An ephemeral record tracking an open position\'s diagnostic state. Converted to Trade Result when position closes.' },
    { id: '123', term: 'Margin Monitor Service', category: 'Aequitas Platform', definition: 'A background service in Aequitas that checks equity ratios every 3 minutes and sends alerts when margin requirements are breached.' },
    { id: '124', term: 'Stop Order Service', category: 'Aequitas Platform', definition: 'A background worker in Aequitas that monitors pending stop orders every 3 seconds and triggers them when conditions are met.' },
    { id: '125', term: 'Intent Preservation', category: 'Aequitas Platform', definition: 'Critical feature ensuring that when a stop order triggers, the child order inherits the parent\'s intent. Prevents "cannot open long" errors when covering shorts.' },
    { id: '126', term: 'Shortable Instrument', category: 'Aequitas Platform', definition: 'An instrument with is_shortable flag set to true in Aequitas. Only these instruments can be sold short.' },
    { id: '127', term: 'Economic Unit', category: 'Aequitas Platform', definition: 'In trade diagnostics, a complete trade from entry to exit where net quantity returns to zero. The fundamental unit of analysis.' },
    { id: '128', term: 'Calculation Version', category: 'Aequitas Platform', definition: 'A versioning field in Trade Results allowing for algorithm improvements without invalidating historical data. Enables recalculation if diagnostic logic changes.' },
    { id: '129', term: 'Watchlist', category: 'Aequitas Platform', definition: 'A customizable list of instruments for quick monitoring. Supports pinning, reordering, and persists across sessions via localStorage.' },
    { id: '130', term: 'Commission Cap', category: 'Aequitas Platform', definition: 'In Aequitas, commissions are 0.03% of trade value or ₹20, whichever is lower. This cap prevents excessive fees on large trades.' },
];

const CATEGORIES = [
    'Market Basics',
    'Order Types & Execution',
    'Technical Indicators',
    'Portfolio & Position Management',
    'Risk Management',
    'Market Microstructure',
    'Trading Metrics & Analytics',
    'Advanced Concepts',
    'Aequitas Platform',
];

const Glossary: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTerms = useMemo(() => {
        let terms = GLOSSARY_DATA;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            terms = terms.filter(
                (term) =>
                    term.term.toLowerCase().includes(query) ||
                    term.definition.toLowerCase().includes(query) ||
                    term.category.toLowerCase().includes(query)
            );
        }

        return terms;
    }, [searchQuery]);

    const termsByCategory = useMemo(() => {
        const grouped: Record<string, GlossaryTerm[]> = {};
        filteredTerms.forEach((term) => {
            if (!grouped[term.category]) {
                grouped[term.category] = [];
            }
            grouped[term.category].push(term);
        });
        return grouped;
    }, [filteredTerms]);

    return (
        <div className="custom-module-page glossary-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Reference</div>
                    <h1>Financial Glossary</h1>
                    <p className="hero-lead">
                        Your comprehensive reference for trading terminology. 135 essential terms across 9 categories—from market basics to Aequitas platform specifics.
                    </p>
                </div>
                <div className="hero-visual">
                    <div className="gear-visual">
                        <div className="gear large"></div>
                        <div className="gear small"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                {/* Search Bar */}
                <div className="glossary-search-section">
                    <input
                        type="text"
                        className="glossary-search-input"
                        placeholder="Search terms... (e.g., 'market order', 'RSI', 'margin')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="clear-search-btn"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Results Count */}
                {searchQuery && (
                    <div className="search-results-info">
                        Found <strong>{filteredTerms.length}</strong> term{filteredTerms.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </div>
                )}

                {/* Terms by Category */}
                {CATEGORIES.map((category) => {
                    const categoryTerms = termsByCategory[category] || [];
                    if (categoryTerms.length === 0) return null;

                    return (
                        <section
                            key={category}
                            id={`category-${category.replace(/\s+/g, '-')}`}
                            className="glossary-category-section"
                        >
                            <div className="category-header">
                                <h2>{category}</h2>
                                <span className="term-count">{categoryTerms.length} terms</span>
                            </div>

                            <div className="terms-grid">
                                {categoryTerms.map((term) => (
                                    <div key={term.id} className="term-card">
                                        <h3 className="term-name">{term.term}</h3>
                                        <p className="term-definition">{term.definition}</p>

                                        {term.formula && (
                                            <div className="term-formula">
                                                <span className="formula-label">Formula:</span>
                                                <code>{term.formula}</code>
                                            </div>
                                        )}

                                        {term.example && (
                                            <div className="term-example">
                                                <span className="example-label">Example:</span>
                                                <p>{term.example}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                {/* No Results */}
                {filteredTerms.length === 0 && (
                    <div className="no-results">
                        <p>No terms found matching "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery('')} className="primary-btn">
                            Clear Search
                        </button>
                    </div>
                )}
            </div>

            <ScrollToTop />
        </div>
    );
};

export default Glossary;
