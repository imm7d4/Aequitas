import React from 'react';

const PatternReliability: React.FC = () => {
    return (
        <section className="guide-section align-right">
            <div className="section-header">
                <span className="step-num">06</span>
                <h2>Pattern Reliability Guide</h2>
            </div>
            <p>Not all patterns are equally reliable. Factors affecting accuracy:</p>

            <div className="glass-card">
                <h3>📊 Reliability Factors</h3>
                <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Factor</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>High Reliability</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '0.5rem' }}><strong>Volume</strong></td>
                            <td style={{ padding: '0.5rem' }}>High volume on reversal candle</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem' }}><strong>Location</strong></td>
                            <td style={{ padding: '0.5rem' }}>At support/resistance levels</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem' }}><strong>Timeframe</strong></td>
                            <td style={{ padding: '0.5rem' }}>Daily or higher</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="glass-card darker">
                <h3>⚠️ Warning Signs</h3>
                <p>Patterns can fail. Watch for:</p>
                <ul>
                    <li>No volume confirmation</li>
                    <li>Conflicting signals (Bullish pattern in Bearish trend)</li>
                    <li>Major news events</li>
                </ul>
            </div>
        </section>
    );
};

export default PatternReliability;
