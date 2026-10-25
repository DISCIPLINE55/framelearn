# Technical Decision Log (ADR) — FrameLearn

This log documents Architectural Decision Records (ADRs) and key technical choices made throughout the lifecycle of FrameLearn.

---

## ADR-001: Choice of React, TypeScript, and Vite
- **Date**: October 2026
- **Status**: Accepted
- **Context**: The project required a modern, highly responsive frontend that compiles swiftly, provides strong type contracts, and runs reliably in continuous integration.
- **Decision**: Selected React 18 with TypeScript 5 and Vite 6 over Next.js or Create React App.
- **Consequences**:
  - Instant development server start times and rapid HMR.
  - Zero server-side runtime dependency overhead for Milestone 001/002.
  - Straightforward static compilation deployable to Vercel or any static edge CDN.

---

## ADR-002: Tailwind CSS with Custom Brand Tokens over Pre-built Component Frameworks
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Pre-built component libraries (such as MUI or Bootstrap) impose opinionated styling, heavy CSS bundles, and generic aesthetics that clash with the bespoke brand identity for FrameLearn.
- **Decision**: Implemented Tailwind CSS configured with approved brand tokens: Primary Navy (`#10212B`), Sage Green (`#8FA464`), and Light Cream (`#EFFBDD`), supplemented by vanilla CSS tokens in `theme.css`.
- **Consequences**:
  - Total control over visual aesthetics, font pairings (Outfit + Inter), and WCAG AA contrast compliance.
  - Minimal CSS footprint in production (`dist/assets/*.css` < 40 kB).
  - Explicit utility classes guarantee deterministic layout behavior.

---

## ADR-003: Phased Milestone Gated Architecture
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Academic software projects often suffer from scope creep or premature implementation of backend tables before foundational architecture is validated.
- **Decision**: Adopt a strict gated milestone model (Milestones 001 through 008). No business database tables or live authentication are implemented prior to their designated milestone.
- **Consequences**:
  - Clear milestone boundaries and reproducible grading milestones for supervisors.
  - High test confidence and zero orphaned database tables.

---

## ADR-004: Zero Browser-Native Dialogs Policy
- **Date**: October 2026
- **Status**: Accepted
- **Context**: `window.alert()`, `window.confirm()`, and `window.prompt()` freeze browser threads, look unbranded, disrupt screen readers, and fail accessibility standards.
- **Decision**: Strictly prohibit all browser-native dialogs across FrameLearn. Implement a branded, accessible Toast system (`useToast`) and a confirmation dialog (`ConfirmDialog`).
- **Consequences**:
  - Unifies operational feedback under approved brand colors.
  - Enables non-blocking user interaction, `aria-live` screen-reader announcements, and keyboard close shortcuts.

---

## ADR-005: Markdown as Single Source of Truth for Documentation
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Maintaining documentation in external tools (Notion, Google Docs, or CMS) causes documentation to drift out of sync with code commits.
- **Decision**: Store all documentation as standard Markdown files in `docs/` within the Git repository, and load them into the application's `#design-system` showcase using Vite's static raw module resolution.
- **Consequences**:
  - Documentation is version-controlled in lockstep with feature pull requests.
  - Zero external CMS dependency or recurring hosting cost.
  - Direct in-app viewing, copying, and Markdown bundle export without duplicate maintenance.

---

## ADR-006: Accessible Custom Lightbox over Third-Party Photo Plugins
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Many popular photo lightbox libraries (Lightbox2, PhotoSwipe) carry legacy jQuery dependencies or bloated asset overhead.
- **Decision**: Author a custom accessible React Lightbox primitive leveraging existing design tokens, focus trapping, and keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape`).
- **Consequences**:
  - Zero extra npm dependencies.
  - Full keyboard accessibility and responsive scaling tailored to FrameLearn's aspect ratio system.

---

## ADR-007: Safe Local Backend Foundation & Strict Zero-Simulation Policy
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Frontend projects often silently substitute fake credentials, mock logins, or simulated database queries when backend configuration is missing, creating a false impression of functional readiness.
- **Decision**: Implement `isSupabaseConfigured()`. When environment variables are missing or set to placeholder templates, halt unroutable network traffic, display clear instructional setup notices in the UI, and refuse to simulate fake authentication or fake database success.
- **Consequences**:
  - Honest operational feedback: the application never claims to be connected or authenticated unless verified.
  - Zero risk of committing service-role keys or using mock logins as substitutes for real security.
  - Clear, reproducible developer instructions for setting up live Supabase credentials.

---

## ADR-008: Additive Version-Controlled SQL Migrations with RLS Security Definer Functions
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Ad-hoc database modification via cloud dashboards leads to schema drift between environments and missing audit records.
- **Decision**: All database schema alterations must be authored as version-controlled, timestamped SQL migrations under `supabase/migrations/` using idempotent DDL. Row Level Security is enforced on all tables, with administrative permissions checked via PostgreSQL security definer function `public.is_admin()`.
- **Consequences**:
  - Deterministic and non-destructive schema migrations.
  - Client personal identifiable information (PII) is shielded at the database layer, independent of frontend code.

---

## ADR-009: Decoupled Public Booking Inquiries from Mandatory User Accounts
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Requiring clients to register an account before submitting a photography inquiry causes significant friction and user abandonment. However, public write access to a database table risks data leakage if reads are unconstrained.
- **Decision**: Allow public (anonymous) visitors to INSERT booking inquiries into `booking_requests` without creating an account. Concurrently, enforce RLS policies that strictly deny SELECT/UPDATE/DELETE operations to the public, restricting reads exclusively to the authenticated photographer (`is_admin()`).
- **Consequences**:
  - Frictionless booking inquiry flow for public prospective clients.
  - Complete protection of client contact numbers, email addresses, and event notes against unauthorized inspection.

---

## ADR-010: Database Migration Security Hardening & Safe Role Bootstrapping
- **Date**: October 2026
- **Status**: Accepted
- **Context**: During the pre-application security review of the initial database migration, two critical privilege escalation vulnerabilities and a search-path hijacking risk were identified:
  1. `handle_new_user()` accepted `raw_user_meta_data->>'role'`, enabling arbitrary admin self-assignment at signup.
  2. The profile update RLS policy permitted users to update their own row without preventing modification of the `role` column.
  3. `SECURITY DEFINER` functions lacked a pinned `search_path`.
- **Decision**: Remediate all three vectors prior to applying the migration:
  1. Enforce default role as `'client'` in `handle_new_user()`, completely ignoring client-supplied role metadata. Provision the `'admin'` role only for the very first user registered in an empty database or the designated photographer address (`arafat@framelearn.com`).
  2. Implement a dedicated `protect_profile_role` PostgreSQL trigger (`BEFORE UPDATE ON public.profiles`) that raises an unhandled exception if a non-administrator attempts to alter the `role` column.
  3. Enforce `SET search_path = public, pg_temp;` on all `SECURITY DEFINER` functions (`is_admin`, `handle_new_user`, `protect_profile_role`) and trigger procedures.
- **Consequences**:
  - Defense-in-depth security enforced at the PostgreSQL database engine level.
  - Zero possibility of client-side role elevation through signup payloads or profile update calls.
  - Immune to schema search-path injection attacks.

---

## ADR-011: Milestone 002 Corrective Authorization, Privilege Hardening & Database Performance Stabilization
- **Date**: October 2026
- **Status**: Accepted
- **Context**: Comprehensive security inspection of Milestone 002 revealed:
  1. *Frontend privilege escalation fallback*: `AuthContext.tsx` contained `const fallbackRole = (userMetaRole as ProfileRole) || 'admin';`, granting administrative privileges if a database profile was missing, delayed, or if a user set metadata `role: 'admin'`.
  2. *Automatic admin provisioning in PostgreSQL*: `handle_new_user()` promoted the first registered user to admin and hardcoded `arafat@framelearn.com`.
  3. *SECURITY DEFINER function exposure*: Functions `handle_new_user()`, `protect_profile_role()`, and `is_admin()` retained execution privileges for `PUBLIC` and `anon`.
  4. *Performance Advisor findings*: Unindexed foreign keys on `booking_requests(package_id)` and `booking_status_history(changed_by)`, multiple permissive update policies on `profiles`, and unoptimized `auth.uid()` calls without initPlan caching.
  5. *Migration history reconciliation*: Table `supabase_migrations.schema_migrations` had no recorded migrations because the initial migration was applied via the Supabase Dashboard SQL Editor under an organization boundary that prevented CLI linking.
- **Decision**:
  1. *Frontend authorization hardening*: Remove all fallbacks. Role is sourced strictly from a verified database profile row. Missing profiles or fetch errors set `role = null` and populate `profileError`. Authenticated non-admins receive an accessible "Unauthorized Account" view with retry and sign-out options, eliminating redirect loops.
  2. *Eliminate automatic promotion*: Update `handle_new_user()` so public signups unconditionally receive `'client'`. Admin accounts must be promoted via authorized database owner action.
  3. *Function ACL hardening*: Revoke execute on `handle_new_user()` from `PUBLIC`, `anon`, and `authenticated`; revoke execute on `protect_profile_role()` and `is_admin()` from `PUBLIC` and `anon`. Partition `services` and `service_packages` SELECT policies so `anon` does not evaluate `is_admin()`.
  4. *Performance remediation*: Add covering indexes `idx_booking_requests_package_id` and `idx_booking_status_history_changed_by`. Combine permissive update policies on `profiles` and wrap `(SELECT auth.uid())`.
  5. *Safe migration reconciliation*: Provide version-controlled additive migration `20261025000001_m002_corrective_hardening.sql` that idempotently registers migration versions into `supabase_migrations.schema_migrations`.
- **Consequences**:
  - Eliminates frontend and database privilege escalation vectors completely.
  - Resolves Supabase Security Advisor and Performance Advisor findings.
  - Maintains zero-disruption compatibility with existing database records and application architecture.

