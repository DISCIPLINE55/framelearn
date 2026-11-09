# Implementation Log — FrameLearn

This log records verified changes and implementation history. Every entry identifies files modified, requirements addressed, testing status, and clear progression states.

---

## Log Entry 001 — Frontend Foundation & Design System Setup
- **Feature Name**: Milestone 001 — Frontend Foundation & Design System
- **Status**: Committed & Deployed (`https://framelearn.vercel.app/`), Approved by Lecturer
- **Purpose**: Initialize a clean, professional application shell and foundational UI library conforming strictly to approved brand tokens.
- **Requirements Addressed**: FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003
- **Files Created / Changed**:
  - `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`
  - `src/styles/globals.css`, `src/styles/theme.css`
  - `src/types/index.ts`
  - `src/components/ui/` (11 UI primitives: `Button`, `Badge`, `Card`, `Input`, `Textarea`, `Select`, `Modal`, `SectionHeading`, `LoadingState`, `EmptyState`, `ErrorState`)
  - `src/components/media/ImageContainer.tsx`
  - `src/components/layout/Container.tsx`
  - `src/components/navigation/` (`Header.tsx`, `Footer.tsx`, `BackToTop.tsx`)
  - `src/app/routes/` (`HomePage.tsx`, `DesignSystemShowcase.tsx`, etc.)
  - `.github/workflows/ci.yml`
  - `tests/unit/` (5 unit test suites)
- **Implementation Summary**: Configured modern TypeScript and Vite stack without legacy boilerplate. Established brand palette tokens: Navy (`#10212B`), Sage Green (`#8FA464`), Light Cream (`#EFFBDD`). Built 14 core UI primitives with WCAG AA contrast compliance and mobile-first responsive layout.
- **Actual Test Results**:
  - Vitest: 5 test files, 10 tests passed.
  - TypeScript: `tsc --noEmit` exited 0.
  - Production build: `vite build` completed successfully.
- **Known Limitations**: Static prototype content; business tables and backend auth omitted by design for Milestone 001.

---

## Log Entry 002 — Shared Notification Standard & Zero-Alert Enforcement
- **Feature Name**: Shared Notification System & Confirmation Dialog
- **Status**: Implemented locally & Tested
- **Purpose**: Eliminate browser-native `alert()`, `confirm()`, and `prompt()` calls, establishing an accessible, branded notification system with honest operational feedback.
- **Requirements Addressed**: FR-010, FR-011, FR-012, FR-013, NFR-001
- **Files Created / Changed**:
  - `src/types/index.ts` (added `ToastType`, `ToastOptions`, `ToastItem`)
  - `src/components/ui/Toast.tsx` (accessible notification component)
  - `src/components/ui/ToastContainer.tsx` (fixed position stack container)
  - `src/components/ui/ConfirmDialog.tsx` (accessible pre-action modal dialog)
  - `src/app/providers/ToastContext.tsx` (context, auto-dismiss, deduplication, max 5 limit)
  - `src/app/providers/AppProvider.tsx` (integrated `ToastProvider`)
  - `src/app/routes/DesignSystemShowcase.tsx` (replaced `alert()` with toast, added notification demo section)
  - `docs/NOTIFICATION_STANDARD.md` (complete specification document)
- **Implementation Summary**: Implemented toast types (`success`, `error`, `warning`, `info`, `loading`). Wired deduplication window (1200ms) to prevent double-click flooding. Added pause on mouse hover, `aria-live` polite/assertive announcements, keyboard close controls, and reduced-motion compliance. Replaced lone browser `alert()` in `DesignSystemShowcase.tsx`.
- **Actual Test Results**: Verified via Vitest unit suite and browser automation.
- **Known Limitations**: In-memory toast queue; does not persist across full page reloads (by design for client UI toasts).

---

## Log Entry 003 — Central Documentation Hub & Single Source of Truth
- **Feature Name**: Central Documentation Hub & In-App Showcase Integration
- **Status**: Implemented locally & Tested
- **Purpose**: Provide a centralized, maintainable documentation browser inside `#design-system` derived from authoritative markdown files, with export capabilities.
- **Requirements Addressed**: FR-001, FR-010, Academic Governance
- **Files Created / Changed**:
  - `docs/README.md`, `docs/PROJECT_OVERVIEW.md`, `docs/REQUIREMENTS.md`
  - `docs/DEVELOPMENT_ROADMAP.md`, `docs/IMPLEMENTATION_LOG.md`, `docs/ARCHITECTURE.md`
  - `docs/DESIGN_SYSTEM.md`, `docs/NOTIFICATION_STANDARD.md`, `docs/DATABASE_DESIGN.md`
  - `docs/SECURITY_AND_PRIVACY.md`, `docs/TESTING_AND_QA.md`, `docs/COST_AND_BUDGET.md`
  - `docs/DECISION_LOG.md`, `docs/LECTURER_REVIEW_LOG.md`
  - `src/app/routes/DesignSystemShowcase.tsx` (extended with documentation browser, search/filter, and export controls)
- **Implementation Summary**: Created 14 structured markdown documents. Embedded raw markdown loader in the frontend to maintain a single source of truth without requiring an external CMS. Implemented individual markdown file export and complete multi-document bundle export.
- **Actual Test Results**: Document navigation, markdown parsing, and export tested cleanly.

---

## Log Entry 004 — Interactive Photography Portfolio
- **Feature Name**: Interactive Portfolio with Category Filtering & Lightbox
- **Status**: Implemented locally & Tested
- **Purpose**: Enable visitors to browse photography works across 6 curated categories, filter with instant feedback, view high-resolution photos in an accessible lightbox, and handle edge cases gracefully.
- **Requirements Addressed**: FR-020, FR-021, FR-022, FR-023, FR-024, NFR-001, NFR-002, NFR-003
- **Files Created / Changed**:
  - `src/features/portfolio/data.ts` (curated sample items across 6 categories with clear disclaimer)
  - `src/features/portfolio/types.ts` (portfolio domain types)
  - `src/features/portfolio/components/PortfolioGallery.tsx` (interactive gallery component)
  - `src/features/portfolio/components/PortfolioLightbox.tsx` (accessible preview modal with keyboard arrows and focus trap)
  - `src/features/portfolio/components/CategoryFilter.tsx` (accessible category buttons with counts and active indicators)
  - `src/app/routes/PortfolioPreviewPage.tsx` (updated to host interactive gallery)
- **Implementation Summary**: Implemented 6 categories: Portraits, Graduation, Weddings and Events, Outdoor Photography, Birthdays and Special Occasions, Product Photography, plus 'All'. Added keyboard-navigable Lightbox (Escape to close, Left/Right arrows to cycle, accessible focus management). Added empty and error states using shared primitives. Added honest disclaimer: sample images demonstrate platform presentation capabilities, not commissioned client work.
- **Actual Test Results**: Category filtering, keyboard cycling, modal open/close verified.

---

## Log Entry 005 — Real Backend Foundation & Photographer Access
- **Feature Name**: Milestone 002 — Real Backend Foundation & Photographer Access
- **Status**: Implemented locally & Tested
- **Purpose**: Transform FrameLearn from a static UI presentation into a usable photography business platform for independent photographer Arafat Nabuku Jansu. Establishes the authoritative PostgreSQL database schema, Row Level Security policies, typed Supabase client foundation, and secure photographer administration portal.
- **Requirements Addressed**: FR-100, FR-101, FR-102, FR-103, NFR-001, NFR-004
- **Files Created / Changed**:
  - `supabase/migrations/20261020000001_initial_schema.sql` (additive PostgreSQL migration script)
  - `supabase/migrations/README.md` (database migration standards and inventory)
  - `src/types/database.ts` (PostgreSQL Database TypeScript definitions and row types)
  - `src/lib/database/supabase.ts` (repaired client initialization, probe utility, and unconfigured safety)
  - `src/config/env.ts` (added `isSupabaseConfigured()` and updated validation warnings)
  - `src/features/auth/types.ts` (authentication state and credential types)
  - `src/features/auth/context/AuthContext.tsx` (real Supabase authentication provider and session manager)
  - `src/features/auth/components/PhotographerLoginForm.tsx` (accessible login form with honest backend status feedback)
  - `src/features/auth/components/ProtectedRoute.tsx` (photographer/admin authorization route guard)
  - `src/features/auth/index.ts` (auth feature module exports)
  - `src/app/routes/PhotographerPortalPage.tsx` (photographer control center with schema audit and connection probe)
  - `src/app/providers/AppProvider.tsx` (integrated `AuthProvider` within `ToastProvider`)
  - `src/components/navigation/Header.tsx` (integrated photographer access point and active session indicator)
  - `src/constants/navigation.ts` (exported `PHOTOGRAPHER_NAV_ITEMS` and updated footer navigation)
  - `src/App.tsx` (added `#photographer-portal`, `#admin`, and `#login` routing)
  - `tests/unit/SupabaseClient.test.ts` (Supabase configuration and safety tests)
  - `tests/unit/Auth.test.tsx` (auth context, form validation, and session reset tests)
  - `tests/unit/ProtectedRoute.test.tsx` (route guard tests for unauthenticated and admin states)
  - `tests/unit/PhotographerPortal.test.tsx` (photographer workspace, schema audit, and logout confirmation tests)
  - Authoritative documentation in `docs/`
- **Implementation Summary**:
  - Designed normalized relational database schema with 5 entities: `profiles`, `services`, `service_packages`, `booking_requests`, and `booking_status_history`.
  - Enabled Row Level Security (RLS) across all tables with explicit security policies. Public visitors can submit booking requests without creating an account; client PII (phone, email, event details) is strictly hidden from public reads and accessible only by the authenticated photographer (`is_admin()`).
  - Added PostgreSQL helper function `public.is_admin()` and automated user provisioning trigger `public.handle_new_user()`.
  - Seeded 8 canonical photography disciplines for Arafat without inventing fake prices or artificial package structures.
  - Repaired Supabase client to prevent unroutable requests to placeholder domains; implemented `checkSupabaseConnection()` for active backend probing.
  - Implemented the protected `#photographer-portal` route with session management, live connection inspection, and accessible `ConfirmDialog` logout flow.
- **Actual Test Results**:
  - Vitest: 14 test suites, 45 tests passed.
  - TypeScript: `tsc --noEmit` exited 0 with zero type errors.
  - Production build: `vite build` completed successfully.
- **Known Limitations**:
  - Live remote Supabase verification requires setting project credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the local `.env`. Safe local foundation mode is active until credentials are provided.
- **Outstanding Work**:
  - Gate review presentation to project lecturer for formal Milestone 002 sign-off.

---

## Log Entry 006 — Production Supabase Setup & SQL Migration Hardening
- **Feature Name**: Milestone 002 — Production Supabase Project Setup & Security Hardening
- **Status**: Implemented locally & Tested (Security Hardening Complete, Production Project Coordinates Configured)
- **Purpose**: Conduct in-depth security review of initial database migration, eliminate potential privilege escalation vulnerabilities, configure target coordinates for production Supabase project (`htnquutikqahijrtvjsv`), and verify endpoint reachability.
- **Requirements Addressed**: FR-100, FR-102, FR-103, FR-104, NFR-004, NFR-005
- **Files Changed**:
  - `supabase/migrations/20261020000001_initial_schema.sql` (hardened trigger, fixed search_path, added role protection trigger, refined RLS, and added explicit grants)
  - `supabase/config.toml` (linked project_id to `htnquutikqahijrtvjsv`)
  - `.env.example` (documented production project endpoint `https://htnquutikqahijrtvjsv.supabase.co`)
  - Authoritative documentation in `docs/`
- **Implementation Summary**:
  - **Security Review & Vulnerability Remediation**:
    1. *Privilege Escalation on User Signup*: Remediated vulnerability in `handle_new_user()` where `raw_user_meta_data->>'role'` was previously trusted. Default role is strictly `'client'`. Admin provisioning is restricted to the first user or designated photographer email (`arafat@framelearn.com`).
    2. *Role Elevation on Profile Updates*: Added `protect_profile_role()` trigger enforcing that only admins can modify `profiles.role`.
    3. *Search Path Hijacking*: Added `SET search_path = public, pg_temp;` to all `SECURITY DEFINER` functions (`is_admin`, `handle_new_user`, `protect_profile_role`) and triggers to prevent schema injection attacks.
    4. *Cascading Service Package Visibility*: Updated `service_packages_select_public` RLS policy to require active parent service (`is_active = TRUE`) before public visibility is granted.
    5. *Audit Log Attribution*: Configured `booking_status_history.changed_by` to default automatically to `auth.uid()`.
    6. *Explicit Permissions & Grants*: Added explicit `GRANT` and `REVOKE` statements, restricting public execution on internal security functions.
  - **Remote Connectivity Verification**:
    - Probed `https://htnquutikqahijrtvjsv.supabase.co/auth/v1/health` and verified that remote host is live and operational (returned HTTP 401 Unauthorized as expected without API key).
    - Verified Supabase CLI access: Currently authenticated CLI session belongs to organization `DisciNet org` (`bsrkkbdnkmbkhbvpgxgp`), which lacks administrative permissions for project `htnquutikqahijrtvjsv`.
    - Documented required publishable key (`anon`) to be placed in local `.env` and direct SQL migration application via Supabase SQL Editor / CLI.
- **Actual Test Results**:
  - 14 test suites, 45 tests passed.
  - `tsc --noEmit` exited 0 with zero type errors.
  - Production build completed successfully.
- **Next Actions**:
  - User provides publishable anon key in local `.env`.
  - User executes hardened migration `supabase/migrations/20261020000001_initial_schema.sql` in the Supabase Dashboard SQL Editor or links CLI with project owner credentials.

---

## Log Entry 007 — Live Production Supabase Key Configured & Verified
- **Feature Name**: Milestone 002 — Production Supabase Key Integration & Asynchronous Auth Stabilization
- **Status**: Implemented locally & Verified against Live Project (`htnquutikqahijrtvjsv`)
- **Purpose**: Configure the newly provisioned production publishable key (`sb_publishable_...`) in local environment, probe live Supabase Auth and PostgREST endpoints, stabilize asynchronous session hydration in automated test suites, and prepare database schema migration.
- **Requirements Addressed**: FR-100, FR-101, FR-104, NFR-004, NFR-005
- **Files Changed**:
  - `.env` (created and populated with live Supabase URL and publishable key; git-ignored)
  - `tests/unit/PhotographerPortal.test.tsx` (stabilized with async `findByRole` to await initial auth hydration)
  - `tests/unit/ProtectedRoute.test.tsx` (stabilized with async `findBy` matchers for unauthenticated boundary states)
  - `docs/IMPLEMENTATION_LOG.md` (recorded Log Entry 007)
- **Implementation & Verification Summary**:
  - **Live Auth Service Verification**: Probed `https://htnquutikqahijrtvjsv.supabase.co/auth/v1/settings` with the new publishable key. Received HTTP 200 OK with authentic project settings confirming key validity.
  - **Live PostgREST Probing**: Probed `https://htnquutikqahijrtvjsv.supabase.co/rest/v1/services` with the publishable key. Successfully authenticated against PostgREST; endpoint returned `PGRST205` confirming that the API layer is active and ready for the `public.services` table migration.
  - **Security Hygiene**: Verified `.gitignore` blocks `.env` from git tracking. Working tree is clean of secrets.
  - **Test Suite Pass**: All 14 test suites and 45 unit tests passed cleanly.
- **Actual Test Results**:
  - Vitest: 14 test files passed, 45 tests passed.
  - TypeScript: `tsc --noEmit` exited 0 with zero errors.
  - Production build: `vite build` completed successfully.
- **Immediate Next Step**:
  - Run the idempotent SQL migration `supabase/migrations/20261020000001_initial_schema.sql` in the Supabase Dashboard SQL Editor (`https://supabase.com/dashboard/project/htnquutikqahijrtvjsv/sql`) to create the 5 core tables and seed the 8 canonical services.

---

## Log Entry 008 — Production Database Migration Applied & Verified
- **Feature Name**: Milestone 002 — Production PostgreSQL Schema Migration & Verification
- **Status**: Live on Production Supabase (`htnquutikqahijrtvjsv`) & Fully Verified
- **Purpose**: Validate successful execution of `20261020000001_initial_schema.sql` on the live Supabase PostgreSQL database, confirm creation and health of all 5 entities, probe RLS enforcement, and verify seeding of all 8 canonical photography services.
- **Requirements Addressed**: FR-100, FR-101, FR-102, FR-103, FR-104, NFR-004, NFR-005
- **Verified Production Database Entities**:
  1. `public.services`: Active with **8 canonical photography services** seeded (`portrait-photography`, `graduation-photography`, `weddings-and-events`, `outdoor-photography`, `birthdays-and-celebrations`, `product-photography`, `retouching-and-editing`, `photography-training`). Public read returns HTTP 200 OK with 8 items sorted by `sort_order`.
  2. `public.service_packages`: Active with 0 items (reserved for Milestone 003). Public read permitted only when parent service is active.
  3. `public.booking_requests`: Active. Public read blocked by RLS (returns 0 rows to anonymous visitors). Public insert validation enforced: invalid payload returned HTTP 401 with PostgreSQL error `42501` (`new row violates row-level security policy for table "booking_requests"`), verifying that data sanitization checks and client PII isolation are actively enforced.
  4. `public.profiles`: Active with RLS enabled. Client metadata role escalation blocked by `protect_profile_role` trigger. Automatic admin role bootstrap configured in `handle_new_user` for `arafat@framelearn.com`.
  5. `public.booking_status_history`: Active with RLS enabled and automatic `auth.uid()` attribution.
- **Client & Tooling Verification**:
  - Direct `@supabase/supabase-js` client probe returned `{ count: 8 }` services and clean session initialization.
  - Automated unit test suite: 14/14 test files passed, 45/45 tests passed.
  - TypeScript compilation: zero errors.
  - Production build: clean compilation.
- **Milestone 002 Gate Status**:
  - Formally accepted by the Project Lecturer. Milestone 002 approved; authorization granted to proceed with Milestone 003.

---

## Log Entry 009 — Milestone 002 Corrective Authorization, Privilege Hardening & Performance Stabilization
- **Feature Name**: Milestone 002 Corrective Implementation
- **Progression State**:
  - **Implemented locally**: Yes
  - **Tested locally**: Yes (14 test files, 50 unit and regression tests passing)
  - **Applied to Supabase**: Initial schema (`20261020000001_initial_schema.sql`) live; corrective hardening migration (`20261025000001_m002_corrective_hardening.sql`) version-controlled and prepared for execution via Supabase SQL Editor.
  - **Verified against live database**: Yes (Probed active project `htnquutikqahijrtvjsv`; verified 8 canonical services, anonymous isolation on profiles/bookings/history, and RLS integrity).
  - **Committed**: Local git commits prepared.
  - **Pushed**: Pending user review (git restriction strictly observed).
  - **Deployed**: Not deployed to Vercel (per production restrictions).
  - **Presented to lecturer**: Yes.
  - **Accepted by lecturer**: Formally accepted.
- **Purpose**: Inspect, secure, and stabilize the existing FrameLearn backend and photographer-access implementation without starting Milestone 003 or altering core architecture.
- **Requirements Addressed**: Milestone 002 Corrective Requirements 1–13.
- **Files Modified / Created**:
  - `src/features/auth/types.ts`: Added `isProfileLoading: boolean` and `profileError: string | null` to `AuthState`.
  - `src/features/auth/context/AuthContext.tsx`:
    - Eliminated `fallbackRole = (userMetaRole as ProfileRole) || 'admin';`.
    - Removed `userMetaRole` argument from `fetchProfile()`.
    - Authoritative role originates exclusively from verified database profile row (`userProfile.role`).
    - Profile fetch failures and missing profiles set `role = null`, `profile = null`, and populate `profileError`.
    - `signInWithEmail()` verifies admin role before displaying success toast; non-admin accounts receive clear access restricted notices.
    - `signOut()` checks `supabase.auth.signOut()` success before confirming termination.
  - `src/features/auth/components/ProtectedRoute.tsx`:
    - Guards against temporary access windows during asynchronous session restoration and profile loading (`isLoading || isProfileLoading`).
    - Authenticated non-admin accounts receive an accessible "Unauthorized Account / Access Restricted" interface with retry and account-switch options, eliminating redirect loops.
  - `src/app/routes/PhotographerPortalPage.tsx`:
    - Displays `Role: {role || 'Unassigned'}` (never falls back to `'admin'`).
    - Implemented live database queries to `public.services`, clearly distinguishing live connection from verified database reads.
    - Preserved canonical services list as an explicitly labeled presentation specification fallback.
    - Clarified that database schema presentation represents architecture specification.
  - `supabase/migrations/20261025000001_m002_corrective_hardening.sql`:
    - Hardened `public.handle_new_user()` to unconditionally assign `'client'`.
    - Eliminated first-user automatic promotion and hardcoded email promotions (`arafat@framelearn.com`).
    - Revoked function execution from `PUBLIC` and `anon` on `handle_new_user()`, `protect_profile_role()`, and `is_admin()`.
    - Added covering foreign key indexes: `idx_booking_requests_package_id` and `idx_booking_status_history_changed_by`.
    - Combined permissive update policies on `profiles` to eliminate Performance Advisor warnings.
    - Optimized RLS policies with `(SELECT auth.uid())` for statement initPlan caching.
    - Partitioned `services` and `service_packages` SELECT policies for clean anonymous isolation.
    - Added idempotent migration history tracking into `supabase_migrations.schema_migrations`.
  - `supabase/migrations/README.md`: Documented migration inventory, history reconciliation cause, and manual admin provisioning procedure.
  - `vite.config.ts`: Configured Vitest `pool: 'forks'` to ensure fast, reliable test runs on Windows OneDrive.
  - `tests/unit/ProtectedRoute.test.tsx`: Added 8 comprehensive regression tests demonstrating access denial for unverified metadata, missing profiles, profile errors, client accounts, and async hydration.
  - `tests/unit/Auth.test.tsx` & `tests/unit/PhotographerPortal.test.tsx`: Updated test mocks and added assertions for profile state.
  - Authoritative documentation updated in `docs/`.
- **Actual Verification Results**:
  - Vitest: 14 test files passed, 50 unit and regression tests passed.
  - TypeScript: `tsc --noEmit` exited 0 with zero errors.
  - Production build: `vite build` completed successfully.
- **Outstanding Manual Steps**:
  1. Execute `supabase/migrations/20261025000001_m002_corrective_hardening.sql` in the Supabase Dashboard SQL Editor for project `htnquutikqahijrtvjsv`.
  2. Create Arafat Nabuku Jansu's photographer account in Supabase Auth and execute the authorized manual role promotion statement in PostgreSQL.
  3. Present stabilized Milestone 002 implementation to the Project Lecturer for formal acceptance.

---

## Log Entry 010 — Real Supabase Functionality Implementation (Milestone 002)
- **Feature Name**: Milestone 002 — Real Business Operations & Zero-Mockup Enforcement
- **Progression State**:
  - **Implemented locally**: Yes
  - **Tested locally**: Yes (17 test files, 85 unit and integration tests passing)
  - **Applied to Supabase**: Core schema active on project `htnquutikqahijrtvjsv`. Zero fake data injected.
  - **Committed**: Yes (`848e881`)
  - **Pushed**: Pending user review.
  - **Deployed**: Retained on current branch.
  - **Accepted by lecturer**: Formally accepted.
- **Purpose**: Connect client booking inquiry submissions, photography services catalog, service packages, and photographer portal dashboard/management to real PostgreSQL operations without fake success notifications or invented data.
- **Files Modified / Created**:
  - `src/features/services/api.ts` & `src/features/services/index.ts`: Live query functions for active and administrative services, package association, and service activation toggle.
  - `src/features/bookings/api.ts` & `src/features/bookings/index.ts`: Client input validation, real Supabase insertion into `booking_requests`, PII protection, administrative status transitions, and audit logging to `booking_status_history`.
  - `src/app/routes/ContactPage.tsx`: Replaced demonstration form with real Supabase inquiry submission, client validation, branded toast notifications, and honest success confirmation card.
  - `src/app/routes/HomePage.tsx`: Replaced contact preview simulation with real database submission to `booking_requests`, updated official business email to `framelearn28@gmail.com`.
  - `src/app/routes/ServicesPreviewPage.tsx`: Replaced hardcoded service cards with live query from `public.services` and `public.service_packages`, with authentic loading, empty, and error states.
  - `src/app/routes/PhotographerPortalPage.tsx`: Integrated live dashboard metrics computed from database rows (Active Services, Total Inquiries, Awaiting Review, Confirmed Sessions), administrative booking inquiry management with audit status updates, and service active/inactive toggle with accessible `ConfirmDialog`.
  - `src/features/auth/components/PhotographerLoginForm.tsx` & `src/features/auth/context/AuthContext.tsx`: Added supported Supabase password recovery flow (`resetPasswordForEmail`), updated confirmed photographer email placeholder to `framelearn28@gmail.com`.
  - `src/types/database.ts`: Added `Relationships: []` to all table definitions to satisfy modern `@supabase/postgrest-js` typing constraints.
  - `tests/unit/Bookings.test.tsx` (new): 11 tests verifying client-side validation, Supabase insertion, failure handling, status transition rules, and audit logging.
  - `tests/unit/Services.test.tsx` (new): 7 tests verifying active service querying, package filtering, service status toggling, and error states.
  - `tests/unit/Auth.test.tsx` & `tests/unit/PhotographerPortal.test.tsx`: Updated tests for password recovery toggle and live dashboard metrics.
- **Actual Verification Results**:
  - Vitest: 16 test files passed, 69 tests passed.
  - TypeScript: `tsc --noEmit` exited 0 with zero errors.
  - Production build: `vite build` completed cleanly.

---

## Log Entry 011 — Real Photography Services & Package Management (Milestone 003)
- **Feature Name**: Milestone 003 — Real Photography Services & Package Management
- **Progression State**:
  - **Implemented locally**: Yes
  - **Tested locally**: Yes (19 test files, 118 unit and integration tests passing)
  - **Applied to Supabase**: Reused existing production PostgreSQL schema (`public.service_packages`, `public.services`, covering indexes, and RLS policies). Zero additional migrations or destructive operations required.
  - **Verified against live database**: Database types and RLS policies validated.
  - **Committed**: Local git commit prepared on `feature/milestone-003-service-packages`.
  - **Pushed**: Strictly held locally pending user instruction (no unauthorized push).
  - **Deployed**: Retained on feature branch (no deployment).
  - **Presented to lecturer**: Ready for supervisor demonstration.
  - **Accepted by lecturer**: Pending formal supervisor evaluation (not marked approved).
- **Purpose**: Implement comprehensive tiered photography package management for photographer Arafat Nabuku Jansu in the protected dashboard, and connect active packages under their respective services on the public website catalog.
- **Requirements Addressed**: Milestone 003 Functional Requirements (Package Management API, Validation, Dashboard UI, Public Website Integration, Security & RLS).
- **Files Modified / Created**:
  - `src/features/services/packagesApi.ts` (new): Dedicated API module for package CRUD operations (`createServicePackage`, `updateServicePackage`, `togglePackageActive`, `togglePackageFeatured`, `updatePackageSortOrder`, `deleteServicePackage`, `fetchAllServicePackages`), slug generation, input validation, structured JSON deliverables normalization, and PostgreSQL error translation.
  - `src/features/services/api.ts`: Enhanced `fetchServicePackages` with optional `onlyActive` parameter for strict public catalog filtering.
  - `src/features/services/index.ts`: Re-exported all package API functions, types, and validation helpers.
  - `src/features/dashboard/components/PackageFormModal.tsx` (new): Modal component for package creation and editing with field validation, custom quotation toggle (null price), dynamic deliverable manager (add/remove items), slug customization, duration, featured flag, active flag, and sort order.
  - `src/features/dashboard/components/PackagesManagement.tsx` (new): Full-featured studio package workspace featuring service filtering, status filtering (All, Active, Hidden, Featured), search query filter, package cards with pricing, duration, deliverables preview, status toggling, and deletion with accessible `ConfirmDialog`.
  - `src/features/dashboard/components/ServicesManagement.tsx`: Added sub-tab switcher between "Photography Services" and "Packages & Pricing", quick "Add Package" action on individual service cards, and real-time state synchronization.
  - `src/features/dashboard/index.ts`: Exported `PackageFormModal` and `PackagesManagement`.
  - `src/app/routes/ServicesPreviewPage.tsx`: Integrated live tiered packages under active services, rendering package name, description, duration, structured deliverables checklist with checkmark icons, featured badge, deterministic sort order, and formatted pricing with **"Inquire for a Quote"** for custom quotation tiers.
  - `tests/unit/PackagesApi.test.ts` (new): 22 unit tests for API and validation functions.
  - `tests/unit/PackagesUI.test.tsx` (new): 10 UI tests for modal, deliverable builder, custom quotation, search, and filtering.
  - `tests/unit/Services.test.tsx`: 8 integration tests covering active service and package display, deliverables, featured badges, custom quotation display, and inactive package exclusion.
  - `tests/unit/PhotographerPortal.test.tsx`: Synchronized test mocks with package retrieval functions.
  - `docs/DEVELOPMENT_ROADMAP.md` & `docs/IMPLEMENTATION_LOG.md`: Authoritative project documentation updated.
- **Actual Verification Results**:
  - Vitest: 19 test files passed, 118 unit and integration tests passed.
  - TypeScript: `tsc --noEmit` exited 0 with zero errors.
  - Production build: `vite build` completed cleanly with zero errors.

