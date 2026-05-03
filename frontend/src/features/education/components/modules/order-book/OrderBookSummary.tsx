import React from 'react';
import { Link } from 'react-router-dom';

export const OrderBookSummary: React.FC = () => (
    <>
        <section className="guide-section align-right">
            <div className="section-header"><span className="step-num">10</span><h2>Key Takeaways</h2></div>
            <div className="glass-card darker">
                <ul>
                    <li>✅ <strong>Order book shows live supply/demand</strong></li>
                    <li>✅ <strong>Spread is the cost of immediacy</strong></li>
                    <li>✅ <strong>Depth reveals pressure</strong></li>
                    <li>✅ <strong>Walls act as support/resistance</strong></li>
                    <li>✅ <strong>Price-time priority rules</strong></li>
                    <li>✅ <strong>Large orders cause slippage</strong></li>
                </ul>
            </div>
        </section>

        <div className="exit-cta">
            <h3>Master Order Execution Next</h3>
            <p>Learn why orders sometimes don't fill and how to troubleshoot execution issues.</p>
            <Link to="/education/why-orders-fail" className="primary-btn">Why Orders Don't Fill</Link>
        </div>
    </>
);
