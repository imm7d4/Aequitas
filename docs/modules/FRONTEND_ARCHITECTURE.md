# Module: Frontend Architecture

## 1. Overview
The Aequitas frontend is a modern, reactive single-page application (SPA) built with **React**, **Vite**, and **TypeScript**. It follows a **Feature-Driven Design (FDD)** to maintain scalability and isolation between business domains.

---

## 2. Directory Structure

The project is organized to separate global concerns from specific business features:

```text
src/
├── app/        # App-wide config, Providers, Router
├── assets/     # Static images, styles
├── features/   # Independent business modules (Auth, Trading, Portfolio)
├── lib/        # External library configs (Axios, Zustand)
├── shared/     # Reusable UI components, hooks, and utils
└── main.tsx    # Entry point
```

---

## 3. Feature-Driven Design (FDD)

Each directory in `src/features/` is a self-contained module that follows a consistent sub-structure:

- **`components/`**: Feature-specific UI (e.g., `TradePanel.tsx`).
- **`hooks/`**: Custom hooks for business logic (e.g., `useMarketData.ts`).
- **`services/`**: API wrappers (e.g., `orderService.ts`).
- **`types/`**: TypeScript interfaces for state and API responses.
- **`store/`**: Local state management (Zustand).

---

## 4. State Management

Aequitas uses a hybrid approach to state:

1.  **Zustand (Global)**: Used for high-frequency or cross-feature data.
    - `useAuthStore`: User session and identity.
    - `useNotificationStore`: Live alerts.
    - `useMarketStore`: Real-time price updates (synced with WebSockets).
2.  **React State (Local)**: Used for UI-only concerns (e.g., whether a modal is open).
3.  **React Query (Data Fetching)**: Used for server-side state (Orders, Holdings) to handle caching and re-validation automatically.

---

## 5. Real-Time Communication

The frontend maintains a persistent **WebSocket** connection for low-latency updates:
- **Hook**: `useWebSocket.ts`.
- **Flow**:
    1. Connection established on app mount.
    2. Backend pushes JSON messages tagged with `TYPE` (e.g., `TICK`, `ORDER_UPDATE`).
    3. The hook dispatches data to relevant Zustand stores.
    4. React components re-render automatically based on store selection.

---

## 6. Design System

Aequitas uses **Material UI (MUI) v5** with a custom theme to achieve a premium "Glassmorphism" look.
- **Tokens**: Colors, spacing, and typography are centralized in `src/app/theme.ts`.
- **Chart Logic**: Interactive charts use the `lightweight-charts` library for high-performance canvas rendering.

---

## 7. Developer Guide

### Creating a New Feature
1. Create a directory in `src/features/[feature_name]`.
2. Define types first.
3. Create an API service in `services/`.
4. Build UI components using `shared/components` where possible.

### Styling Guidelines
- **Prefer MUI System**: Use the `sx` prop or `Box` component for consistent spacing.
- **Responsive Design**: Use the `useMediaQuery` hook or MUI's responsive array syntax (e.g., `width: { xs: '100%', md: '50%' }`).

### Common Troubleshooting
- **"WebSocket Disconnected"**: Check the backend URL in `.env`. The frontend expects `VITE_WS_URL`.
- **"Styles not applying"**: Ensure components are wrapped in the `ThemeProvider` within `src/app/App.tsx`.
