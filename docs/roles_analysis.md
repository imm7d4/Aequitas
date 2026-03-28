# Administrative Roles Analysis: Aequitas Platform

This document provides a detailed analysis of the administrative (non-trader) roles defined for the Aequitas Trading Platform, focusing on governance, safety, and operational integrity.

## Core Governance Principles

### 1. Separation of Duties (SoD) & Split Admin
To mitigate the "Single Point of Failure" risk of a single SuperAdmin, the platform splits executive power:
- **PlatformAdmin (Ops & Config)**: Manages platform logic, market states, and approval queues. Cannot modify or verify audit logs.
- **AuditAdmin (Integrity & Forensics)**: Manages audit logs, telemetry, and forensic verification. Cannot perform financial or operational actions.

### 3. Just-in-Time (JIT) Scoping & Workflow
Administrative roles do not have permanent "Write" access. 
- **Scoping**: JIT grants are limited by `max_amount` (e.g., ₹10,000 credit), `max_uses` (e.g., 1 execution), and `expires_at` (e.g., 15 mins).
- **Workflow State**: `PENDING` → `APPROVED/REJECTED` (by PlatformAdmin) → `ACTIVE` → `EXPIRED/COMPLETED`.
- **SLA**: Requests auto-expire if not approved within a configurable time window.

### 4. Step-Up Authentication & Dual Approval
- **Step-Up Auth**: Critical actions (Market Halt, Large Adjustments) require a fresh MFA challenge (TOTP/Email), even if the session is active.
- **Dual Approval**: Extremely high-risk actions (e.g., `max_order_value` changes, `Global Halt`) require approval from **two independent checkers**.

### 5. Hash Chain Anchoring
To prevent full-chain rewrite attacks, the hash chain is periodically anchored:
- **External Anchoring**: Every 1,000 entries, the current chain hash is stored in an external immutable store (e.g., S3 Object Lock) and sent via a signed email snapshot to the **AuditAdmin**.

---

## Role Definitions & Functional Analysis

### L1: Executive Governance (The Split)
- **PlatformAdmin**: The operational "Maker-Checker" for all L2-L4 actions. Inherits visibility of all operational metrics.
- **AuditAdmin**: The guardian of the "Truth Chain". Has exclusive write-access to audit verification utilities and read-access to all logs.

### L2: Strategic Safety (Risk & Compliance)
- **Risk Officer**: Sets the safety boundaries (Margins, Halts). Acts as a Checker for Risk-related JIT requests.
- **Compliance Officer**: Manages identity integrity. Acts as a Checker for KYC-related JIT requests.

### L4: Functional Support (The "Maker" & Helpdesk)
- **Support**: Initiates interventions (e.g., manual wallet adjustments). Every financial change is **staged** and requires **PlatformAdmin** or **Risk Officer** approval.
- **Ticketing**: Responsible for resolving user inquiries, managing ticket lifecycles, and engaging in asynchronous communication via comments.
- **Escalation**: Must request **JIT access** for even a single manual credit action.

---

## Summary of Role Access

| Feature | Support | Compliance | Risk | Exec | AuditAdmin | PlatformAdmin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Search User** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Adjust Wallet** | 📝 *(Maker)* | ❌ | ❌ | ❌ | ❌ | ✅ *(Checker)* |
| **Change KYC Status** | ❌ | ✅ *(Maker)* | ❌ | ❌ | ❌ | ✅ *(Checker)* |
| **Configure Margins** | ❌ | ❌ | ✅ *(Maker)* | ❌ | ❌ | ✅ *(Checker)* |
| **Global Market Halt** | ❌ | ❌ | ❌ | ❌ | ❌ | 🔐 *(Dual Auth)* |
| **Audit Analytics** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ *(Read)* |
| **Hash Verification** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Step-Up MFA Req.** | 🔴 HIGH | 🟡 MED | 🔴 HIGH | ⚪ NONE | 🔴 HIGH | 🔴 HIGH |
| **JIT Window** | 🔴 HIGH | 🟡 MED | 🔴 HIGH | ⚪ NONE | ⚪ NONE | ⚪ NONE |

---

## Technical Enforcement Strategy

1. **MW-Admin-Auth**: The middleware must verify both the `role` and the `action_id`.
2. **Resource Masking**: Depending on the role, the API will return masked data (e.g., Support sees `192.168.x.x`, Compliance sees the full IP).
3. **Audit Ingestion**: Every action performed by any role must be piped to the `admin_audit_logs` with the `correlation_id` of the admin session.
