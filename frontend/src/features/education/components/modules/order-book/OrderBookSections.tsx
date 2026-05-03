import React from 'react';

export const DefinitionSection: React.FC = () => (
    <section className="guide-section">
        <div className="section-header">
            <span className="step-num">01</span>
            <h2>What is an Order Book?</h2>
        </div>
        <p>The Order Book is a live, real-time list of all pending buy and sell orders for a stock. It shows you exactly where traders want to buy or sell, and in what quantities.</p>

        <div className="glass-card">
            <h3>The Two Sides of the Book</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                    <h4 style={{ color: '#22c55e' }}>📗 Bid Side (Buyers)</h4>
                    <p><strong>Who:</strong> Traders waiting to BUY</p>
                    <p><strong>Price:</strong> Maximum they'll pay</p>
                    <p><strong>Sorted:</strong> Highest price first</p>
                    <p><strong>Example:</strong> "I'll buy 100 shares at ₹500"</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                    <h4 style={{ color: '#ef4444' }}>📕 Ask Side (Sellers)</h4>
                    <p><strong>Who:</strong> Traders waiting to SELL</p>
                    <p><strong>Price:</strong> Minimum they'll accept</p>
                    <p><strong>Sorted:</strong> Lowest price first</p>
                    <p><strong>Example:</strong> "I'll sell 100 shares at ₹502"</p>
                </div>
            </div>
        </div>

        <div className="info-box tip">
            <strong>💡 Key Insight:</strong> The order book only shows <strong>limit orders</strong>. Market orders execute immediately and don't appear in the book.
        </div>
    </section>
);

export const SnapshotSection: React.FC = () => (
    <section className="guide-section align-right">
        <div className="section-header">
            <span className="step-num">02</span>
            <h2>Reading a Real Order Book</h2>
        </div>
        <p>Let's analyze a real order book for Reliance Industries:</p>

        <div className="glass-card darker">
            <h3>Reliance Order Book Snapshot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', marginTop: '1rem' }}>
                {/* Bid Side */}
                <div>
                    <h4 style={{ color: '#22c55e', textAlign: 'center' }}>BID (Buy Orders)</h4>
                    <table style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Price</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                                <td style={{ padding: '0.5rem' }}><strong>₹2,450.00</strong></td>
                                <td style={{ padding: '0.5rem', textAlign: 'right' }}><strong>500</strong></td>
                            </tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,449.95</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>1,200</td></tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,449.90</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>800</td></tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,449.50</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>3,000</td></tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,449.00</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>2,500</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Spread */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Spread</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>₹0.10</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>(0.004%)</div>
                    </div>
                </div>

                {/* Ask Side */}
                <div>
                    <h4 style={{ color: '#ef4444', textAlign: 'center' }}>ASK (Sell Orders)</h4>
                    <table style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Price</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                                <td style={{ padding: '0.5rem' }}><strong>₹2,450.10</strong></td>
                                <td style={{ padding: '0.5rem', textAlign: 'right' }}><strong>600</strong></td>
                            </tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,450.15</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>900</td></tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,450.20</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>1,500</td></tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,450.50</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>5,000</td></tr>
                            <tr><td style={{ padding: '0.5rem' }}>₹2,451.00</td><td style={{ padding: '0.5rem', textAlign: 'right' }}>4,000</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <h4>What This Tells Us:</h4>
                <ul>
                    <li><strong>Best Bid:</strong> ₹2,450.00 (highest price buyers will pay)</li>
                    <li><strong>Best Ask:</strong> ₹2,450.10 (lowest price sellers will accept)</li>
                    <li><strong>Spread:</strong> ₹0.10 (very tight - highly liquid stock)</li>
                    <li><strong>Bid Depth:</strong> 8,000 shares waiting to buy within ₹1 of best bid</li>
                    <li><strong>Ask Depth:</strong> 12,000 shares waiting to sell within ₹1 of best ask</li>
                    <li><strong>Imbalance:</strong> More sellers than buyers → slight selling pressure</li>
                </ul>
            </div>
        </div>
    </section>
);
