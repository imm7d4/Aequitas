import React from 'react';

export const RiskComparison: React.FC = () => (
    <div className="glass-card caution">
        <h3>Long vs Short: Asymmetric Risk</h3>
        <div className="comparison-grid">
            <div className="comparison-col">
                <h4>Long Position (Buying Stock)</h4>
                <div className="risk-visual long">
                    <div className="risk-bar">
                        <div className="max-loss">Max Loss: 100%</div>
                        <div className="max-gain">Max Gain: Unlimited</div>
                    </div>
                </div>
                <p><strong>Worst Case:</strong> Stock goes to ₹0 → You lose 100%</p>
                <p><strong>Best Case:</strong> Stock rises indefinitely → Unlimited profit</p>
                <p className="risk-note">Risk-Reward: <span className="success-text">Favorable</span></p>
            </div>
            <div className="comparison-col danger">
                <h4>Short Position (Selling Stock)</h4>
                <div className="risk-visual short">
                    <div className="risk-bar">
                        <div className="max-gain">Max Gain: 100%</div>
                        <div className="max-loss">Max Loss: Unlimited</div>
                    </div>
                </div>
                <p><strong>Best Case:</strong> Stock goes to ₹0 → You profit 100%</p>
                <p><strong>Worst Case:</strong> Stock rises indefinitely → Unlimited loss</p>
                <p className="risk-note">Risk-Reward: <span className="danger-text">Unfavorable</span></p>
            </div>
        </div>
        <div className="info-box danger">
            <strong>Example of Unlimited Loss:</strong> Short 100 shares @ ₹500 (₹50k position). If price hits ₹5,000, loss is ₹4,50,000 (4,500% of margin)! <strong>No ceiling to potential loss!</strong>
        </div>
    </div>
);
