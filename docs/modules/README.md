# Aequitas Modular Documentation

Welcome to the technical deep-dive of the Aequitas platform. This directory contains detailed architectural and implementation notes for each core module, designed to onboard new developers and serve as a reference for architects.

## 🗺️ Module Index

Explore each module in depth:

1.  **[Identity & Access (Auth)](IDENTITY.md)**: User registration, secure login, and demo fund provisioning.
2.  **[Order Management System (OMS)](OMS.md)**: Synchronous order lifecycle, Stop-Loss triggers, and Trailing Stops.
3.  **[Matching Engine](MATCHING_ENGINE.md)**: Price-Time matching, fee calculations, and trade execution.
4.  **[Portfolio & Accounting](PORTFOLIO.md)**: WAP (Weighted Average Price) math, Realized P&L tracking, and holdings management.
5.  **[Universal Trade Diagnostics](trade_diagnostics.md)**: FIFO Matching Engine, MAE/MFE analysis, and economic audits.
6.  **[Market Data & Pricing](MARKET_DATA.md)**: Real-time price simulation, candle building, and market session logic.
7.  **[Notification System](NOTIFICATIONS.md)**: Persistent and real-time alerts.
8.  **[Frontend Architecture](FRONTEND_ARCHITECTURE.md)**: Feature-driven React design, state management, and WebSockets.

---

## 🚀 Onboarding Roadmap for Developers

If you are new to the codebase, we recommend following this reading order:

### 1. The Big Picture
Start with the [High-Level System Architecture](../SYSTEM_ARCHITECTURE.md) to understand the tech stack and data flow.

### 2. The Trading Core
Read **[OMS](OMS.md)** followed by **[Matching Engine](MATCHING_ENGINE.md)**. This is the most complex part of the system where orders are validated and turned into trades.

### 3. Financial Logic
Study **[Portfolio & Accounting](PORTFOLIO.md)** to understand how we maintain ledger accuracy and calculate P&L.

### 4. Client Side
Explore **[Frontend Architecture](FRONTEND_ARCHITECTURE.md)** to see how the React application interacts with the Go backend via REST and WebSockets.

---

## 🛠️ Global Standards
- **Backend**: CSR (Controller-Service-Repository) pattern. No direct repository calls from controllers.
- **Frontend**: FDD (Feature-Driven Design). Every feature is self-contained.
- **Communication**: JSON over HTTPS for actions; JSON over WSS for data streams.
