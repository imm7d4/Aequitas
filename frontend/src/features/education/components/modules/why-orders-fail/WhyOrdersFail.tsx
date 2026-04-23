import React from 'react';
import { Link } from 'react-router-dom';
import '../ModuleStyles.css';
import RejectionReasons from './RejectionReasons';
import ExecutionFailures from './ExecutionFailures';
import TemporalAndMarketFailures from './TemporalAndMarketFailures';
import OrderDiagnosticGuide from '../trading-diagnostics/OrderDiagnosticGuide';

const WhyOrdersFail: React.FC = () => {
    return (
        <div className="custom-module-page order-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill danger">Troubleshooting</div>
                    <h1>Why Orders Don't Fill: Complete Troubleshooting Guide</h1>
                    <p className="hero-lead">"The price touched my limit but I wasn't filled!" Learn the real reasons why orders fail and how to fix them.</p>
                </div>
                <div className="hero-visual">
                    <div className="failed-order-visual">
                        <div className="ghost-order"></div>
                        <div className="price-line-jump"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <RejectionReasons />
                <ExecutionFailures />
                <TemporalAndMarketFailures />
                <OrderDiagnosticGuide />

                <section className="guide-section">
                    <div className="section-header">
                        <span className="step-num">11</span>
                        <h2>Key Takeaways</h2>
                    </div>
                    <div className="glass-card darker">
                        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li>✅ <strong>Most "failures" are normal market mechanics</strong> - Not bugs or errors</li>
                            <li>✅ <strong>Check funds first</strong> - Account for buffer (1%) and fees (0.03%)</li>
                            <li>✅ <strong>Price gaps are real</strong> - Chart lines don't mean trades happened</li>
                            <li>✅ <strong>Queue position matters</strong> - Earlier orders fill first at same price</li>
                            <li>✅ <strong>Lot sizes are enforced</strong> - Must be multiples (100, 200, 300...)</li>
                            <li>✅ <strong>Validity matters</strong> - IOC cancels fast, DAY expires at close, GTC persists</li>
                            <li>✅ <strong>Market hours matter</strong> - Orders only execute 9:15 AM - 3:30 PM</li>
                            <li>✅ <strong>Circuit breakers halt trading</strong> - Normal safety mechanism</li>
                            <li>✅ <strong>Partial fills are normal</strong> - Especially in illiquid stocks</li>
                            <li>✅ <strong>Use the diagnostic flowchart</strong> - Systematic troubleshooting saves time</li>
                        </ul>
                    </div>
                </section>

                <div className="exit-cta">
                    <h3>Master P&L Calculations Next</h3>
                    <p>Now that you understand order execution, learn how to calculate and track your profits and losses accurately.</p>
                    <Link to="/education/pnl-explained" className="primary-btn">Learn P&L Calculations</Link>
                </div>
            </div>
        </div>
    );
};

export default WhyOrdersFail;
