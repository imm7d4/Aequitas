# Aequitas Frontend

React + TypeScript frontend for Aequitas retail stock trading platform.

## Architecture

This frontend follows **Feature-First Architecture**:

- **Features**: Self-contained business features (auth, orders, wallet, etc.)
- **Shared**: Cross-feature reusable components
- **UI**: Design system primitives
- **Lib**: Low-level libraries (API client, storage)

### Rules

- ❌ Components MUST NOT call APIs
- ❌ Components MUST NOT contain business logic
- ❌ Services MUST NOT import React
- ✅ Single axios instance in `lib/api/apiClient.ts`
- ✅ Hooks orchestrate services
- ✅ Components only render

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## Features

### Authentication (Phase 0)

- **User Registration** (US-0.1.1)
- **Login** (US-0.1.3)
- **Protected Routes**
- **JWT Token Management**

## Tech Stack

- React 18
- TypeScript (strict mode)
- Material UI
- React Router
- Axios
- Zustand (state management)
- Vite

## Environment Variables

See `.env` file for configuration.
