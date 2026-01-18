import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ModuleStyles.css';

const OrderTypes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'market' | 'limit' | 'stop'>('market');

    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill success">Core Execution</div>
                    <h1>Order Types & Logic</h1>
                    <p className="hero-lead">An order is an instruction to the engine. Choosing the wrong type is like choosing the wrong tool for a job—you'll end up paying more for less.</p>
                </div>
                <div className="hero-visual">
                    <div className="order-stack-visual">
                        <div className="layer market">M</div>
                        <div className="layer limit">L</div>
                        <div className="layer stop">S</div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <div className="density-tabs">
                    <button className={activeTab === 'market' ? 'active' : ''} onClick={() => setActiveTab('market')}>Market Orders</button>
                    <button className={activeTab === 'limit' ? 'active' : ''} onClick={() => setActiveTab('limit')}>Limit Orders</button>
                    <button className={activeTab === 'stop' ? 'active' : ''} onClick={() => setActiveTab('stop')}>Stop Orders</button>
                </div>

                {activeTab === 'market' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Aggressive Entry (Liquidity Taker)</h2>
                            <p className="large-text">A Market order says: <strong>"I don't care about the price, I want the shares RIGHT NOW."</strong></p>

                            <div className="property-grid">
                                <div className="prop-card">
                                    <h4>Priority</h4>
                                    <p>Highest. You skip the line in the order book. Your trade is prioritized by the <code>MatchingService</code> instant executor.</p>
                                </div>
                                <div className="prop-card warning">
                                    <h4>Pricing</h4>
                                    <p>Variable. You get the best available price (LTP). We apply a <strong>1% Margin Buffer</strong> to ensure you have enough funds if the price moves during execution.</p>
                                </div>
                                <div className="prop-card">
                                    <h4>Impact</h4>
                                    <p>You are a "Liquidity Taker". Large market orders can move the price against you as you 'eat' the order book.</p>
                                </div>
                            </div>
                        </section>

                        <div className="glass-card caution">
                            <h3>The Slippage Risk</h3>
                            <p>In fast markets, the price you see on the chart might not be the price you get. If LTP moves 0.5% in 1 second, your Market order fills 0.5% away. This is called <strong>Execution Slippage</strong>.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'limit' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Patient Execution (Liquidity Maker)</h2>
                            <p className="large-text">A Limit order says: <strong>"I will only buy if the price is X or better."</strong></p>

                            <div className="formula-block">
                                <h3>Price Improvement Rule</h3>
                                <p>If you set a Limit Buy @ ₹100, but the market price (LTP) is ₹98, Aequitas will fill you at ₹98. This is the <strong>Best Execution Guarantee</strong> found in <code>matching_service.go</code>.</p>
                            </div>

                            <div className="architecture-diagram-custom">
                                <div className="service-node">
                                    <h4>The Queue</h4>
                                    <p>Your order sits in the engine <code>OrderBook</code>, waiting for the price to touch your limit.</p>
                                </div>
                                <div className="connector">→</div>
                                <div className="service-node hotspot">
                                    <h4>Validity: IOC vs GTC</h4>
                                    <p><strong>IOC (Immediate or Cancel)</strong>: If the engine can't match it in the *current* 3-second heartbeat, it auto-cancels. No partial waits.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'stop' && (
                    <div className="tab-pane animate-in">
                        <section className="guide-section">
                            <h2>The Conditional Trigger (Sentinel Mode)</h2>
                            <p className="large-text">A Stop order is "Sleep Mode" for your strategy. It sits inactive in the <code>Pending</code> state until a trigger is hit.</p>

                            <div className="glass-card darker">
                                <h3>Backend Logic: Intent Preservation</h3>
                                <p>This is a custom Aequitas feature. When a Stop Loss triggers, it spawns a Market Order. We ensure the <strong>Original Intent</strong> (e.g., <code>CLOSE_SHORT</code>) is copied perfectly.</p>
                                <div className="info-box tip">
                                    <strong>Why?</strong> Without this, the engine might treat a stop-loss as an 'Open' action if your position was already auto-squared off, leading to unintentional debt.
                                </div>
                            </div>

                            <div className="stop-types-grid">
                                <div className="stop-card sell">
                                    <h4>Sell Stop (Stop Loss)</h4>
                                    <p>Trigger {"<"} LTP. Activates when your long position starts losing value to prevent a total wipeout.</p>
                                </div>
                                <div className="stop-card buy">
                                    <h4>Buy Stop (Breakout)</h4>
                                    <p>Trigger {">"} LTP. Activates when the price breaks a resistance level, helping you join a momentum trend.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <section className="guide-section full-width">
                    <h3>Execution Matrix (Comparison)</h3>
                    <div className="comparison-table-dense">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Market</th>
                                    <th>Limit</th>
                                    <th>Stop</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Match Logic</td>
                                    <td>Immediate on T=0</td>
                                    <td>Polling (3-sec cycle)</td>
                                    <td>Conditional (Sleep)</td>
                                </tr>
                                <tr>
                                    <td>Price Certainty</td>
                                    <td className="red">None (LTP 1% Buffer)</td>
                                    <td className="green">Guaranteed (Limit or Better)</td>
                                    <td>Variable (Once Awake)</td>
                                </tr>
                                <tr>
                                    <td>Fill Certainty</td>
                                    <td className="green">100% Guaranteed</td>
                                    <td className="red">Partial or None</td>
                                    <td className="green">High (Post-Trigger)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default OrderTypes;
