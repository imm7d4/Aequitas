import React from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const ReadingCandles: React.FC = () => {
    return (
        <div className="custom-module-page chart-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Chart Fundamentals</div>
                    <h1>Mastering Candlestick Patterns</h1>
                    <p className="hero-lead">Candlesticks are the language of price action. Each candle tells a story of battle between buyers and sellers. Learn to read these stories and predict future price movements.</p>
                </div>
                <div className="hero-visual">
                    <div className="candle-anatomy-hero">
                        <div className="wick"></div>
                        <div className="body green"></div>
                        <div className="wick"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">01</span>
                        <h2>What is a Candlestick?</h2>
                    </div>
                    <p>A candlestick is a visual representation of price movement over a specific time period. Unlike a simple line chart that only shows closing prices, a candlestick packs <strong>four critical data points</strong> into one elegant shape.</p>

                    <div className="glass-card">
                        <h3>📊 The Four Price Points (OHLC)</h3>
                        <div className="battle-report-anatomy">
                            <div className="report-item">
                                <strong>🔓 Open (O)</strong>
                                <span>The first price traded when the candle period started. Sets the baseline for the battle.</span>
                            </div>
                            <div className="report-item">
                                <strong>⬆️ High (H)</strong>
                                <span>The highest price reached during the entire period. Shows maximum buyer strength.</span>
                            </div>
                            <div className="report-item">
                                <strong>⬇️ Low (L)</strong>
                                <span>The lowest price reached during the entire period. Shows maximum seller pressure.</span>
                            </div>
                            <div className="report-item">
                                <strong>🔒 Close (C)</strong>
                                <span>The final price traded when the candle period ended. Determines who won the battle.</span>
                            </div>
                        </div>
                        <div className="info-box tip">
                            <strong>💡 Why OHLC matters:</strong> These four numbers tell you everything about the battle between buyers and sellers during that time period. Who started strong? Who finished strong? How extreme did the fight get?
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>📈 Real Example: 5-Minute Candle</h3>
                        <p><strong>Stock:</strong> Reliance, 2:00 PM - 2:05 PM</p>
                        <ul>
                            <li><strong>Open:</strong> ₹2,500 (price at 2:00 PM)</li>
                            <li><strong>High:</strong> ₹2,515 (peak reached at 2:03 PM)</li>
                            <li><strong>Low:</strong> ₹2,495 (bottom hit at 2:01 PM)</li>
                            <li><strong>Close:</strong> ₹2,510 (price at 2:05 PM)</li>
                        </ul>
                        <p><strong>Story:</strong> Price opened at ₹2,500, sellers pushed it down to ₹2,495, buyers fought back and pushed to ₹2,515, and it closed at ₹2,510. <span style={{ color: '#4ade80' }}>Bullish candle</span> - buyers won this 5-minute period with a ₹10 gain.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">02</span>
                        <h2>Anatomy of a Candle</h2>
                    </div>
                    <p>Every candlestick has <strong>three main parts</strong>. Understanding these is essential to reading price action.</p>

                    <div className="glass-card darker">
                        <h3>🎯 The Body (Real Body)</h3>
                        <p>The thick rectangular part of the candle. This shows the range between the <strong>Open</strong> and <strong>Close</strong> prices.</p>
                        <div className="property-grid">
                            <div className="prop-card">
                                <h4>🟢 Green/Bullish Body</h4>
                                <p><strong>Close &gt; Open</strong></p>
                                <p>The price moved UP during this period. Buyers were in control. The candle "closed higher" than it opened.</p>
                                <p><strong>Example:</strong> Open ₹100 → Close ₹105 = ₹5 gain</p>
                            </div>
                            <div className="prop-card warning">
                                <h4>🔴 Red/Bearish Body</h4>
                                <p><strong>Close &lt; Open</strong></p>
                                <p>The price moved DOWN during this period. Sellers were in control. The candle "closed lower" than it opened.</p>
                                <p><strong>Example:</strong> Open ₹100 → Close ₹95 = ₹5 loss</p>
                            </div>
                        </div>
                        <p className="large-text">The <strong>size of the body</strong> tells you how decisive the victory was. A large body means strong conviction. A tiny body means indecision.</p>
                    </div>

                    <div className="glass-card">
                        <h3>📏 The Wicks (Shadows)</h3>
                        <p>The thin lines extending above and below the body. These show the <strong>extreme price levels</strong> that were tested but not sustained.</p>

                        <div className="math-grid-dense">
                            <div className="math-card">
                                <h4>Upper Wick (Upper Shadow)</h4>
                                <p>Extends from the top of the body to the <strong>High</strong> of the period.</p>
                                <p className="warning-chip">Shows how high buyers pushed the price before sellers pushed back.</p>
                                <p><strong>Long upper wick = Rejection of higher prices</strong></p>
                            </div>
                            <div className="math-card">
                                <h4>Lower Wick (Lower Shadow)</h4>
                                <p>Extends from the bottom of the body to the <strong>Low</strong> of the period.</p>
                                <p className="warning-chip">Shows how low sellers pushed the price before buyers pushed back.</p>
                                <p><strong>Long lower wick = Rejection of lower prices</strong></p>
                            </div>
                        </div>

                        <div className="info-box warning">
                            <strong>⚠️ Wick Psychology:</strong> Long wicks represent <strong>rejection</strong>. If there's a long upper wick, it means buyers tried to push higher but failed. If there's a long lower wick, sellers tried to push lower but failed. This is critical information about market sentiment.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">03</span>
                        <h2>Single Candle Patterns</h2>
                    </div>
                    <p>Individual candles can provide powerful insights into market psychology. Here are the most important single-candle patterns:</p>

                    <div className="glass-card">
                        <h3>🔨 Hammer (Bullish Reversal)</h3>
                        <p><strong>Appearance:</strong> Small body at the top, long lower wick (2-3x body size), little to no upper wick</p>
                        <p><strong>Psychology:</strong> Sellers pushed price down hard, but buyers rejected the lower prices and pushed back up strongly</p>
                        <p><strong>Signal:</strong> Potential reversal from downtrend to uptrend</p>
                        <p><strong>Example:</strong> Stock falls from ₹100 to ₹90 (low), but closes at ₹98. The ₹8 lower wick shows strong buying pressure.</p>
                        <div className="info-box tip">
                            <strong>Best Context:</strong> Appears after a downtrend, near support levels. Confirms reversal if next candle is bullish.
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>🌠 Shooting Star (Bearish Reversal)</h3>
                        <p><strong>Appearance:</strong> Small body at the bottom, long upper wick (2-3x body size), little to no lower wick</p>
                        <p><strong>Psychology:</strong> Buyers pushed price up hard, but sellers rejected the higher prices and pushed back down strongly</p>
                        <p><strong>Signal:</strong> Potential reversal from uptrend to downtrend</p>
                        <p><strong>Example:</strong> Stock rises from ₹100 to ₹110 (high), but closes at ₹102. The ₹8 upper wick shows strong selling pressure.</p>
                        <div className="info-box warning">
                            <strong>Best Context:</strong> Appears after an uptrend, near resistance levels. Confirms reversal if next candle is bearish.
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>➕ Doji (Indecision)</h3>
                        <p><strong>Appearance:</strong> Open and Close are nearly identical, creating a cross or plus sign shape</p>
                        <p><strong>Psychology:</strong> Neither buyers nor sellers could gain control. Perfect balance or indecision.</p>
                        <p><strong>Signal:</strong> Potential trend reversal or continuation, depending on context</p>
                        <p><strong>Example:</strong> Opens at ₹100, trades between ₹98-₹102, closes at ₹100. Neither side won.</p>
                        <div className="info-box">
                            <strong>Types of Doji:</strong>
                            <ul style={{ marginTop: '0.5rem' }}>
                                <li><strong>Dragonfly Doji:</strong> Long lower wick, no upper wick (bullish)</li>
                                <li><strong>Gravestone Doji:</strong> Long upper wick, no lower wick (bearish)</li>
                                <li><strong>Long-legged Doji:</strong> Long wicks on both sides (extreme indecision)</li>
                            </ul>
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>🟩 Marubozu (Strong Conviction)</h3>
                        <p><strong>Appearance:</strong> Large body with little to no wicks on either side</p>
                        <p><strong>Psychology:</strong> One side completely dominated from open to close, no rejection</p>
                        <p><strong>Signal:</strong> Strong continuation of current trend</p>
                        <p><strong>Bullish Marubozu:</strong> Opens at low, closes at high. Buyers in total control.</p>
                        <p><strong>Bearish Marubozu:</strong> Opens at high, closes at low. Sellers in total control.</p>
                    </div>

                    <div className="glass-card">
                        <h3>🎯 Spinning Top (Indecision)</h3>
                        <p><strong>Appearance:</strong> Small body with long wicks on both sides</p>
                        <p><strong>Psychology:</strong> Both buyers and sellers fought hard, but neither could maintain control</p>
                        <p><strong>Signal:</strong> Indecision, potential trend weakening</p>
                        <p><strong>Example:</strong> Opens at ₹100, trades between ₹95-₹105, closes at ₹101. High volatility but no clear winner.</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">04</span>
                        <h2>Two-Candle Patterns</h2>
                    </div>
                    <p>Combining two candles creates more reliable signals than single candles alone.</p>

                    <div className="glass-card">
                        <h3>🔄 Bullish Engulfing (Strong Reversal)</h3>
                        <p><strong>Pattern:</strong> Small red candle followed by large green candle that completely "engulfs" the previous candle's body</p>
                        <p><strong>Psychology:</strong> Sellers were in control, but buyers came in with overwhelming force</p>
                        <p><strong>Signal:</strong> Strong bullish reversal signal</p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>Day 1: Opens ₹105, closes ₹100 (small red candle)</li>
                            <li>Day 2: Opens ₹98, closes ₹110 (large green candle engulfs Day 1)</li>
                        </ul>
                        <div className="info-box tip">
                            <strong>Reliability:</strong> High when appearing after downtrend with high volume on the engulfing candle.
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>🔄 Bearish Engulfing (Strong Reversal)</h3>
                        <p><strong>Pattern:</strong> Small green candle followed by large red candle that completely "engulfs" the previous candle's body</p>
                        <p><strong>Psychology:</strong> Buyers were in control, but sellers came in with overwhelming force</p>
                        <p><strong>Signal:</strong> Strong bearish reversal signal</p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>Day 1: Opens ₹100, closes ₹105 (small green candle)</li>
                            <li>Day 2: Opens ₹108, closes ₹95 (large red candle engulfs Day 1)</li>
                        </ul>
                    </div>

                    <div className="glass-card">
                        <h3>☁️ Piercing Pattern (Bullish Reversal)</h3>
                        <p><strong>Pattern:</strong> Large red candle followed by green candle that opens below the previous low but closes above the midpoint of the red candle</p>
                        <p><strong>Psychology:</strong> Sellers pushed down, but buyers came back strong and recovered more than half the losses</p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>Day 1: Opens ₹110, closes ₹100 (red candle)</li>
                            <li>Day 2: Opens ₹98, closes ₹106 (pierces through midpoint at ₹105)</li>
                        </ul>
                    </div>

                    <div className="glass-card darker">
                        <h3>☁️ Dark Cloud Cover (Bearish Reversal)</h3>
                        <p><strong>Pattern:</strong> Large green candle followed by red candle that opens above the previous high but closes below the midpoint of the green candle</p>
                        <p><strong>Psychology:</strong> Buyers pushed up, but sellers came back strong and erased more than half the gains</p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>Day 1: Opens ₹100, closes ₹110 (green candle)</li>
                            <li>Day 2: Opens ₹112, closes ₹104 (covers midpoint at ₹105)</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">05</span>
                        <h2>Three-Candle Patterns</h2>
                    </div>
                    <p>Three-candle patterns provide even more context and reliability.</p>

                    <div className="glass-card">
                        <h3>⭐ Morning Star (Bullish Reversal)</h3>
                        <p><strong>Pattern:</strong> Large red candle → Small-bodied candle (any color) → Large green candle</p>
                        <p><strong>Psychology:</strong> Strong selling → Indecision → Strong buying</p>
                        <p><strong>Signal:</strong> Highly reliable bullish reversal</p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>Day 1: ₹110 → ₹100 (strong selling)</li>
                            <li>Day 2: ₹100 → ₹101 (indecision, small body)</li>
                            <li>Day 3: ₹102 → ₹112 (strong buying)</li>
                        </ul>
                        <div className="info-box tip">
                            <strong>💡 Why it works:</strong> The middle candle shows sellers are exhausted. The third candle confirms buyers have taken control.
                        </div>
                    </div>

                    <div className="glass-card darker">
                        <h3>🌙 Evening Star (Bearish Reversal)</h3>
                        <p><strong>Pattern:</strong> Large green candle → Small-bodied candle (any color) → Large red candle</p>
                        <p><strong>Psychology:</strong> Strong buying → Indecision → Strong selling</p>
                        <p><strong>Signal:</strong> Highly reliable bearish reversal</p>
                        <p><strong>Example:</strong></p>
                        <ul>
                            <li>Day 1: ₹100 → ₹110 (strong buying)</li>
                            <li>Day 2: ₹110 → ₹111 (indecision, small body)</li>
                            <li>Day 3: ₹110 → ₹98 (strong selling)</li>
                        </ul>
                    </div>

                    <div className="glass-card">
                        <h3>🎖️ Three White Soldiers (Bullish Continuation)</h3>
                        <p><strong>Pattern:</strong> Three consecutive large green candles, each opening within the previous body and closing higher</p>
                        <p><strong>Psychology:</strong> Sustained, strong buying pressure over three periods</p>
                        <p><strong>Signal:</strong> Strong uptrend continuation</p>
                        <p><strong>Example:</strong> Day 1: ₹100→₹105, Day 2: ₹103→₹108, Day 3: ₹106→₹112</p>
                    </div>

                    <div className="glass-card darker">
                        <h3>🎖️ Three Black Crows (Bearish Continuation)</h3>
                        <p><strong>Pattern:</strong> Three consecutive large red candles, each opening within the previous body and closing lower</p>
                        <p><strong>Psychology:</strong> Sustained, strong selling pressure over three periods</p>
                        <p><strong>Signal:</strong> Strong downtrend continuation</p>
                        <p><strong>Example:</strong> Day 1: ₹110→₹105, Day 2: ₹107→₹102, Day 3: ₹104→₹98</p>
                    </div>
                </section>

                <section className="guide-section align-right">
                    <div className="section-header">
                        <span className="step-num">06</span>
                        <h2>Pattern Reliability Guide</h2>
                    </div>
                    <p>Not all patterns are equally reliable. Here's what affects pattern accuracy:</p>

                    <div className="glass-card">
                        <h3>📊 Reliability Factors</h3>
                        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Factor</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>High Reliability</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Low Reliability</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}><strong>Volume</strong></td>
                                    <td style={{ padding: '0.5rem' }}>High volume on reversal candle</td>
                                    <td style={{ padding: '0.5rem' }}>Low volume</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}><strong>Location</strong></td>
                                    <td style={{ padding: '0.5rem' }}>At support/resistance levels</td>
                                    <td style={{ padding: '0.5rem' }}>Middle of nowhere</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}><strong>Trend</strong></td>
                                    <td style={{ padding: '0.5rem' }}>After extended trend</td>
                                    <td style={{ padding: '0.5rem' }}>In choppy/sideways market</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}><strong>Timeframe</strong></td>
                                    <td style={{ padding: '0.5rem' }}>Daily or higher</td>
                                    <td style={{ padding: '0.5rem' }}>1-minute charts</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}><strong>Confirmation</strong></td>
                                    <td style={{ padding: '0.5rem' }}>Next candle confirms direction</td>
                                    <td style={{ padding: '0.5rem' }}>No follow-through</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="glass-card darker">
                        <h3>⚠️ Pattern Failure Scenarios</h3>
                        <p>Even the best patterns can fail. Watch for these warning signs:</p>
                        <ul>
                            <li><strong>No volume confirmation:</strong> Pattern appears but volume is weak</li>
                            <li><strong>Conflicting signals:</strong> Pattern says buy but trend is strongly down</li>
                            <li><strong>News events:</strong> Unexpected news can invalidate any pattern</li>
                            <li><strong>False breakouts:</strong> Pattern triggers but price immediately reverses</li>
                        </ul>
                        <div className="info-box warning">
                            <strong>Golden Rule:</strong> Never trade a pattern in isolation. Always consider trend, support/resistance, volume, and overall market conditions.
                        </div>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">07</span>
                        <h2>Practical Trading Applications</h2>
                    </div>

                    <div className="glass-card">
                        <h3>🎯 Entry Strategies</h3>
                        <p><strong>Conservative Approach:</strong></p>
                        <ul>
                            <li>Wait for pattern completion</li>
                            <li>Wait for confirmation candle (next candle moves in expected direction)</li>
                            <li>Enter on pullback after confirmation</li>
                            <li><strong>Example:</strong> Bullish engulfing appears → Wait for next green candle → Enter when price dips slightly</li>
                        </ul>
                        <p><strong>Aggressive Approach:</strong></p>
                        <ul>
                            <li>Enter during pattern formation (e.g., during the engulfing candle)</li>
                            <li>Higher risk but better entry price</li>
                            <li>Use tight stop loss</li>
                        </ul>
                    </div>

                    <div className="glass-card darker">
                        <h3>🛡️ Stop Loss Placement</h3>
                        <p>Where to place stop losses based on candlestick patterns:</p>
                        <ul>
                            <li><strong>Hammer/Shooting Star:</strong> Below the low of the wick (for hammer) or above the high (for shooting star)</li>
                            <li><strong>Engulfing Patterns:</strong> Below/above the engulfing candle's low/high</li>
                            <li><strong>Morning/Evening Star:</strong> Below/above the entire pattern's low/high</li>
                        </ul>
                        <p><strong>Example:</strong> Hammer at ₹95 with low at ₹90. Place stop loss at ₹89 (below the wick).</p>
                    </div>

                    <div className="glass-card">
                        <h3>🎯 Profit Targets</h3>
                        <p>How to set realistic profit targets:</p>
                        <ul>
                            <li><strong>Risk-Reward Ratio:</strong> Aim for at least 2:1 (if risking ₹5, target ₹10 profit)</li>
                            <li><strong>Previous Resistance/Support:</strong> Target the next major level</li>
                            <li><strong>Pattern Height:</strong> Measure the pattern and project it (e.g., engulfing candle is ₹10 tall, target ₹10 move)</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">08</span>
                        <h2>Common Mistakes to Avoid</h2>
                    </div>

                    <div className="glass-card caution">
                        <h3>❌ Mistake #1: Trading Every Pattern</h3>
                        <p>Not every pattern is a signal. Most patterns are just noise. Wait for <strong>high-quality setups</strong> with volume confirmation and proper context.</p>
                        <p><strong>Solution:</strong> Only trade patterns that appear at key levels with strong volume.</p>
                    </div>

                    <div className="glass-card caution">
                        <h3>❌ Mistake #2: Ignoring the Trend</h3>
                        <p>A bullish pattern in a strong downtrend is likely to fail. <strong>Trend is your friend.</strong></p>
                        <p><strong>Solution:</strong> Trade reversal patterns only after extended trends. Trade continuation patterns with the trend.</p>
                    </div>

                    <div className="glass-card caution">
                        <h3>❌ Mistake #3: Wrong Timeframe</h3>
                        <p>Patterns on 1-minute charts are unreliable. Patterns on daily charts are much more reliable.</p>
                        <p><strong>Solution:</strong> Focus on 15-minute or higher timeframes for pattern trading.</p>
                    </div>

                    <div className="glass-card caution">
                        <h3>❌ Mistake #4: No Stop Loss</h3>
                        <p>Even the best patterns can fail. Trading without a stop loss is gambling.</p>
                        <p><strong>Solution:</strong> Always set a stop loss based on the pattern's structure before entering the trade.</p>
                    </div>

                    <div className="glass-card caution">
                        <h3>❌ Mistake #5: Forgetting Volume</h3>
                        <p>A pattern without volume is like a car without fuel. It might look good but won't go anywhere.</p>
                        <p><strong>Solution:</strong> Always check volume bars. High volume = strong signal, low volume = weak signal.</p>
                    </div>
                </section>

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">09</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>OHLC tells the story</strong> - Open, High, Low, Close show the complete battle</li>
                            <li>✅ <strong>Body size matters</strong> - Large bodies = conviction, small bodies = indecision</li>
                            <li>✅ <strong>Wicks show rejection</strong> - Long wicks indicate failed attempts to move price</li>
                            <li>✅ <strong>Patterns need context</strong> - Location, trend, and volume determine reliability</li>
                            <li>✅ <strong>Reversal patterns work best</strong> - After extended trends at key levels</li>
                            <li>✅ <strong>Confirmation is crucial</strong> - Wait for the next candle to confirm the pattern</li>
                            <li>✅ <strong>Volume validates patterns</strong> - High volume = strong signal, low volume = weak</li>
                            <li>✅ <strong>Always use stop losses</strong> - Protect yourself when patterns fail</li>
                            <li>✅ <strong>Higher timeframes = more reliable</strong> - Daily patterns beat 1-minute patterns</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master Order Types Next</h3>
                    <p>Now that you can read candlesticks, learn how to use different order types to execute your trading strategies effectively.</p>
                    <Link to="/education/order-types" className="primary-btn">Learn Order Types</Link>
                </div>
            </div>
        </div>
    );
};

export default ReadingCandles;
