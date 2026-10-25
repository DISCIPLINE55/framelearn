# Security and Privacy Policy — FrameLearn

## 1. Overview
FrameLearn processes sensitive photographic assets, private client proofing selections, and personal appointment details for independent photographer Arafat Nabuku Jansu. This document establishes security architecture policies, data privacy guidelines, access-control rules, and defensive programming requirements across all milestones.

---

## 2. Authentication & Authorization (Milestone 002 Implementation)

### 2.1 Row Level Security (RLS)
Every table in the Supabase PostgreSQL database enforces Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).

Security policies are partitioned strictly by authorization tier:
1. **`profiles`**:
   - `SELECT`: Authenticated users can read their own profile (`id = auth.uid()`), or admins can read all profiles (`is_admin()`).
   - `UPDATE`: Authenticated users can update their own details, but role elevation is restricted.
2. **`services` & `service_packages`**:
   - `SELECT`: Public visitors can view active services and packages (`is_active = TRUE`).
   - `INSERT / UPDATE / DELETE`: Restricted to verified administrators (`is_admin()`).
3. **`booking_requests`**:
   - `INSERT`: Public visitors can submit inquiries with required fields (`client_name`, `client_email`, `client_phone`, `message`).
   - `SELECT / UPDATE / DELETE`: Strictly restricted to authenticated administrators (`is_admin()`). Public read is blocked to prevent client PII leakage.
4. **`booking_status_history`**:
   - `SELECT / INSERT`: Strictly restricted to authenticated administrators (`is_admin()`).

### 2.2 Role-Based Access Control (RBAC) & Privilege Protection
- **Authoritative Database Verification**: The administrative `'admin'` role must originate strictly from a trusted, successfully retrieved database profile row. User-editable metadata (`user_metadata.role`), missing profiles, or profile-fetch errors NEVER authorize administrative access and default safely to non-admin status (`isAdmin = false`).
- **Zero Automatic Admin Elevation**: In PostgreSQL `handle_new_user()`, all public signups unconditionally receive the least-privileged `'client'` role. Automatic promotion of the first registered user and hardcoded email-based promotion rules are completely eliminated. Client-supplied signup metadata is ignored.
- **Controlled Administrative Provisioning**: The photographer's administrator account must be provisioned through an authorized process (account creation followed by explicit administrative role assignment by the database owner). No default administrators with hardcoded credentials exist.
- **Trigger-Enforced Role Immutability**: The `protect_profile_role()` trigger intercepts all `UPDATE` queries on `public.profiles`. Any attempt by an authenticated non-admin or profile owner to alter the `role` column raises a security exception.
- **Function Execution Privilege Hardening**:
  - `handle_new_user()`: Execution revoked from `PUBLIC`, `anon`, and `authenticated`. Callable solely by `supabase_auth_admin`, `service_role`, and `postgres`.
  - `protect_profile_role()`: Execution revoked from `PUBLIC` and `anon`. Permitted for `session_user IN ('postgres', 'supabase_admin')`, `service_role`, or verified administrators via `is_admin()`, while strictly blocking role escalation attempts from client application requests.
  - `assign_admin_role(text)`: Dedicated administrative procedure for establishing the photographer administrator. Execution revoked from `PUBLIC`, `anon`, and `authenticated`; granted exclusively to `postgres` (Dashboard SQL Editor) and `service_role`.
  - `is_admin()`: Execution revoked from `PUBLIC` and `anon`. Accessible to `authenticated` for RLS evaluations and recognizes `service_role` context.
  - All security-definer functions declare `SET search_path = public, pg_temp;` to mitigate search-path hijacking.
- **Client & Learner Data Isolation**: Non-admin users are strictly bounded to their own profile row (`id = (SELECT auth.uid())`). Public inquiries in `booking_requests` and audit entries in `booking_status_history` are completely shielded from public read access.

### 2.3 Route Guard & Protected Gateways
- Route `#photographer-portal` (and aliases `#admin`, `#login`) is protected by `<ProtectedRoute>`.
- Asynchronous session restoration and profile loading display a non-blocking loading state, preventing any unauthorized exposure window.
- Unauthenticated visitors are presented with the accessible `PhotographerLoginForm`.
- Authenticated non-admin sessions (e.g. clients, missing profiles, profile-fetch errors) receive an explicit, accessible "Access Restricted / Unauthorized Account" screen with recovery options ("Retry Authorization" and "Sign Out & Switch Account"), avoiding redirect loops or stuck states.
- End-of-session logout requires explicit confirmation via `ConfirmDialog` and verifies successful termination before confirming sign-out.

---

## 3. Data Privacy & Image Asset Protection

1. **Client Identifiable Information (PII)**:
   - Client contact details (phone numbers, event locations, inquiry messages) are confidential.
   - PII is never logged to the browser console or client-facing error outputs.
   - Public visitors cannot query or read existing booking records.
2. **Private Proofing Galleries (Milestone 005 Preparation)**:
   - Private client photographs are never placed in public storage buckets.
   - Presigned download URLs with expiring time-to-live (TTL) will be used for private client asset proofing.
3. **Zero Secrets in Repository**:
   - Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are kept in `.env` and excluded via `.gitignore`.
   - `.env.example` contains only template placeholders.
   - Service-role keys are strictly prohibited in frontend client code.

---

## 4. Defensive Programming & Honest Backend Policy

1. **No Simulated Database Success**: The system never fakes authentication or pretends a booking inquiry was recorded when the backend is unreachable.
2. **Safe Unconfigured Guard**: `isSupabaseConfigured()` explicitly halts operations if credentials are placeholder strings, preventing silent errors or unroutable network traffic.
3. **Zero Browser-Native Dialogs**: Strictly prohibits `window.alert()`, `window.confirm()`, and `window.prompt()`.
4. **XSS & Injection Prevention**: React escapes dynamic bindings automatically. SQL queries use parameterized Supabase PostgREST client methods with check constraints on PostgreSQL tables.
