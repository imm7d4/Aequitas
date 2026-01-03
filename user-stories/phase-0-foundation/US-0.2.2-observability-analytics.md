# US-0.2.2 - Observability & Analytics

**Epic:** EPIC 0.2 - Shell & Navigation  
**Phase:** Phase 0 - Foundation  
**Status:** Completed

## User Story

As an **administrator/developer**  
I want to **track user interactions and system performance within the global shell**  
So that I can **optimize the user experience and identify bottlenecks or issues in real-time**

## Acceptance Criteria

### Interaction Tracking
- [x] **Navigation Events**: Log every route change with a timestamp, source (sidebar, header logo, search), and destination.
- [x] **Search Analytics**: Track search queries (anonymized), identifying popular instruments and "no results found" cases.
- [x] **Notification Metrics**: Track when the notification dropdown is opened, when individual notifications are clicked, and when they are cleared.
- [x] **Feature Usage**: Track sidebar toggle state changes and "Quick Trade" button clicks from search results.

### Event Schema & Versioning
- [x] **Versioned Event Contract**: Every telemetry event must include:
    - `event_name` (string)
    - `event_version` (e.g., v1)
    - `timestamp` (ISO 8601)
    - `session_id`
    - `route`
    - `metadata` (typed key-value object)
- [x] **Backward Compatibility**: Any change to an event payload requires incrementing `event_version`.

### Correlation & Tracing
- [x] **Route Correlation ID**: Each route change generates a unique `correlation_id`.
- [x] **Lifecycle Reuse**: All telemetry emitted during that route lifecycle must include the same `correlation_id`.
- [x] **API Linking**: API latency and error events must attach the active `correlation_id`.

### Event Classification
- [x] **Event Types**: Every event must declare one of: `USER_ACTION`, `SYSTEM_EVENT`, `ERROR_EVENT`.
- [x] **Consistent Naming**: Event names follow `{domain}.{action}` format (e.g., `navigation.route_change`, `search.query_submitted`).

### Error Handling & Severity
- [x] **Severity Levels**: Errors are categorized as `warning`, `error`, or `fatal`.
- [x] **Deduplication**: Identical errors are logged only once per session.
- [x] **Fatal Error Flush**: Fatal errors immediately flush the telemetry buffer.

### Telemetry Resilience
- [x] **Non-Blocking Guarantee**: Telemetry failures must never block UI interactions.
- [x] **Self-Monitoring**: Telemetry service reports its own failure once per session.
- [x] **Buffer Limits**: Telemetry buffer has a fixed max size with a drop-oldest strategy.

### Core KPIs (Tracking Only)
- [x] Track data required to compute:
    - Top navigated routes
    - Search success vs no-result ratio
    - Notification open-to-click rate
    - Median TTI per major route

## Technical Requirements

### Frontend (TypeScript + React)
- **Telemetry Architecture**:
    - **Event Envelope**: All events are wrapped in a common envelope structure before dispatch.
    - **Correlation Context**: `telemetryService` maintains active `correlation_id` via React context or hook.
    - **Batch Dispatch**: Events are batched and flushed on route change, tab close/visibility change, or fatal error.
- **Global Listeners**:
    - `useNavigationTracking.ts`: Hook using `react-router`'s `useLocation` to intercept route changes.
- **Integration**:
    - Hook into `Header.tsx` (Search/Profile) and `Sidebar.tsx` (Navigation).
    - Capture errors via a global Error Boundary and API interceptors.

### Backend (Completed)
- [x] **Model**: `Telemetry` model to store versioned events.
- [x] **Repository**: `BatchInsert` capability for efficient storage.
- [x] **API**: `POST /api/telemetry` for processing batched event envelopes.
- [x] **Validation**: Basic schema validation for incoming JSON batches.

## Implementation Notes
- Telemetry must be **tree-shakable** and disabled in local development by default.
- All telemetry calls must be **side-effect safe** and wrapped in `try/catch`.
- **No telemetry logic is allowed directly inside JSX**; all calls go through hooks or services.
- Use a "Fire and Forget" approach for logging to avoid impacting UI performance.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation based on observability requirements |
| 2026-01-03 | AI Assistant | Added detailed event schema, tracing, and resilience requirements |
