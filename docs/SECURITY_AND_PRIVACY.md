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

### 2.2 Role-Based Access Control (RBAC)
- **Security Definer Function**: PostgreSQL function `public.is_admin()` verifies administrator role against `public.profiles` securely without leaking profile tables.
- **Photographer / Admin**: Possesses authorized management access across booking requests, service definitions, package tiers, and platform settings.
- **Client & Learner Roles**: Architecture provides role fields in `profiles` for future milestones. No self-assignment of roles is permitted.

### 2.3 Route Guard & Protected Gateways
- Route `#photographer-portal` (and aliases `#admin`, `#login`) is protected by `<ProtectedRoute>`.
- Unauthenticated visitors are presented with the accessible `PhotographerLoginForm`.
- Non-admin sessions are denied administrative control access.
- End-of-session logout requires explicit confirmation via `ConfirmDialog`.

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
