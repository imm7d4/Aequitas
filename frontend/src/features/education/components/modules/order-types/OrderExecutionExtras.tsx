import React from 'react';

const OrderExecutionExtras: React.FC = () => {
    return (
        <>
            <section className="guide-section full-width">
                <h3>Execution Matrix (Quick Comparison)</h3>
                <div className="comparison-table-dense">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Market</th>
                                <th>Limit</th>
                                <th>Stop</th>
                                <th>Stop-Limit</th>
                                <th>Trailing Stop</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Execution Speed</td>
                                <td className="green">Immediate</td>
                                <td className="red">Delayed/Never</td>
                                <td className="green">Fast</td>
                                <td>Medium</td>
                                <td className="green">Fast</td>
                            </tr>
                            <tr>
                                <td>Price Certainty</td>
                                <td className="red">None (±1%)</td>
                                <td className="green">Guaranteed</td>
                                <td className="red">None</td>
                                <td className="green">Limit protected</td>
                                <td className="red">None</td>
                            </tr>
                            <tr>
                                <td>Fill Certainty</td>
                                <td className="green">100%</td>
                                <td className="red">Partial/None</td>
                                <td className="green">High</td>
                                <td className="red">Medium</td>
                                <td className="green">High</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="decision-tree-section">
                <h3>🌳 Decision Tree: Which Order Type Should I Use?</h3>
                <div className="tree-container">
                    <div className="tree-node root">
                        <p><strong>Do you need to execute RIGHT NOW?</strong></p>
                        <div className="tree-branches">
                            <div className="branch">
                                <div className="branch-label">YES</div>
                                <div className="tree-node">
                                    <p className="decision">Use <strong>MARKET</strong> order</p>
                                </div>
                            </div>
                            <div className="branch">
                                <div className="branch-label">NO</div>
                                <div className="tree-node">
                                    <p className="decision">Use <strong>LIMIT</strong> or <strong>STOP</strong> variants</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="common-mistakes-section">
                <h3>❌ Common Order Type Mistakes</h3>
                <div className="mistake-card">
                    <h4>1. Market Orders in Illiquid Stocks</h4>
                    <p>Causes high slippage. <strong>✓ Fix:</strong> Use limit orders.</p>
                </div>
                <div className="mistake-card">
                    <h4>2. Setting Stop-Loss Too Tight</h4>
                    <p>Normal volatility triggers it. <strong>✓ Fix:</strong> Use ATR (Average True Range).</p>
                </div>
                <div className="mistake-card">
                    <h4>3. Forgetting About Gap Risk on Stops</h4>
                    <p>Expected max loss 5%, actual loss 15% due to overnight gaps. <strong>✓ Fix:</strong> Avoid overnight risk.</p>
                </div>
            </div>
        </>
    );
};

export default OrderExecutionExtras;
