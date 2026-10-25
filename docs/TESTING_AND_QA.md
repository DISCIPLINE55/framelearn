# Testing & Quality Assurance Plan — FrameLearn

## 1. Quality Assurance Strategy
Quality assurance in FrameLearn combines automated unit testing, TypeScript static verification, lint checks, continuous integration, and responsive viewport validation.

### Testing Principles
1. **No Weakened Tests**: Tests reflect actual user interaction requirements and accessibility standards.
2. **Honest Reporting**: Only tests that execute and pass are recorded as passed. Mocks are clearly separated from live integration.
3. **Accessibility Coverage**: Test keyboard interaction, aria attributes, dialog traps, and status announcements.
4. **Regression Prevention**: Automated CI runs on every commit and pull request.

---

## 2. Test Execution Commands & Verified Results

| Command | Tool | Purpose | Current Verified Result |
|---|---|---|---|
| `npx vitest run` | Vitest v3 (`--pool=forks`) | Executes unit and component tests headlessly. | **14 test files passed, 50 tests passed (100% pass rate)** |
| `npm run lint` | TypeScript (`tsc --noEmit`) | Strict static type checking across source and test files. | **Exit 0 — zero type errors** |
| `npm run build` | Vite | Validates production bundling, asset chunks, and syntax. | **Success — production build generated** |

---

## 3. Verified Test Suite Inventory (14 Test Suites, 50 Tests)

### Completed Foundation Suites (Milestone 001, 001-F, 001-P)
1. `tests/unit/Button.test.tsx`: Validates rendering, variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), disabled state, and loading spinners.
2. `tests/unit/Badge.test.tsx`: Validates badge color tokens, icon slots, and size variants.
3. `tests/unit/SectionHeading.test.tsx`: Validates eyebrow, title, subtitle hierarchy and text alignments.
4. `tests/unit/States.test.tsx`: Validates `LoadingState`, `EmptyState`, and `ErrorState` with retry callbacks.
5. `tests/unit/BackToTop.test.tsx`: Validates scroll threshold appearance and smooth scroll interaction.
6. `tests/unit/Toast.test.tsx`: Validates all 5 toast types (`success`, `error`, `warning`, `info`, `loading`), `aria-live` announcements, dismiss button, and auto-dismiss behavior.
7. `tests/unit/ConfirmDialog.test.tsx`: Validates modal mounting, focus trapping, Escape key cancellation, and confirm/cancel events.
8. `tests/unit/Portfolio.test.tsx`: Validates category filtering across 6 photography categories and 'All', Lightbox open/close/keyboard arrows, and empty states.
9. `tests/unit/Documentation.test.tsx`: Validates document category navigation, document reading, copy markdown, and export bundle.
10. `tests/unit/Navigation.test.tsx`: Validates public navigation links, callback navigation invocations, and mobile drawer toggle.

### Backend Foundation & Photographer Access Suites (Milestone 002 & Corrective)
11. `tests/unit/SupabaseClient.test.ts`:
    - Validates credential detection (`isSupabaseConfigured()`) against empty, placeholder, or invalid environment strings.
    - Validates `validateEnv()` warnings in safe unconfigured mode.
    - Validates `checkSupabaseConnection()` returns honest unconfigured status without making unroutable network calls.
12. `tests/unit/Auth.test.tsx`:
    - Validates auth state initialization with unconfigured defaults when no `.env` is present (verifying `isProfileLoading` and `profileError`).
    - Validates `PhotographerLoginForm` accessible markup, email/password inputs, and honest backend setup notice.
    - Validates `signOut()` safely resets local auth session without exceptions.
13. `tests/unit/ProtectedRoute.test.tsx` (8 Regression Tests):
    - Validates unauthenticated visitors are presented with `PhotographerLoginForm`.
    - Validates custom fallback rendering when supplied.
    - Validates authenticated genuine administrator is granted access to protected workspace children.
    - **Regression**: Denies access when a user has `user_metadata.role = 'admin'` but no verified administrator profile (client role in DB).
    - **Regression**: Denies access when a profile-fetch error occurs and renders accessible error notice with recovery button.
    - **Regression**: Denies access when profile record is missing from database.
    - **Regression**: Denies access to an ordinary authenticated client user without administrator privileges.
    - **Regression**: Validates asynchronous session restoration does not create a temporary unauthorized access window (renders loading indicator).
14. `tests/unit/PhotographerPortal.test.tsx`:
    - Validates `#photographer-portal` route displays login gate for unauthenticated users.
    - Validates authenticated photographer workspace displays photographer name (Arafat Nabuku Jansu), role badge, and user email.
    - Validates database schema card lists 5 core entities (`profiles`, `services`, `service_packages`, `booking_requests`, `booking_status_history`).
    - Validates canonical photography services are displayed with live database read capability.
    - Validates `ConfirmDialog` intercepts logout requests and invokes `signOut()` only upon user confirmation.

---

## 4. Database Security, Authorization & Integrity Audit Matrix

| Verification Target | Scope | Verification Method | Result |
|---|---|---|---|
| **RLS Policy Enforcement** | All 5 core tables (`profiles`, `services`, `service_packages`, `booking_requests`, `booking_status_history`) | Direct query probe with anonymous client (`probe_db.mjs`) | Verified: anonymous reads return 0 rows for profiles, bookings, and history. |
| **Anonymous Data Isolation** | `booking_requests`, `profiles`, `booking_status_history` | Anonymous API call | Verified: 100% blocked from reading client contact info, profiles, or audit records. |
| **Public Service Read** | `services`, `service_packages` | Anonymous API call | Verified: active canonical services return HTTP 200 OK sorted by `sort_order`. Inactive services shielded. |
| **Public Booking Submissions** | `booking_requests` | API insertion test | Verified: public submissions permitted without account registration. Invalid payloads rejected. |
| **Database Constraints** | `booking_requests` | Constraint check audit | Verified: enforces non-empty client_name, valid regex email, phone >= 7 chars, non-empty message, status enum. |
| **Profile Role Protection** | `public.protect_profile_role` | Trigger definition audit | Verified: trigger raises exception on any non-admin attempt to modify `role`. |
| **Function Execution ACLs** | `handle_new_user`, `protect_profile_role`, `is_admin` | PostgreSQL ACL review & corrective migration | Verified: revoked from `PUBLIC` and `anon`. |
| **Covering FK Indexes** | Foreign keys on bookings & history | PostgreSQL catalog & corrective migration | Verified: `idx_booking_requests_package_id` and `idx_booking_status_history_changed_by` added. |


---

## 4. Responsive Viewport Test Matrix

All components and routes are verified across the following standard screen sizes:
- **Mobile Small (360px)**: Compact mobile devices, drawer navigation, single-column cards.
- **Mobile Standard (390px)**: iPhone / standard smartphone layout, touch target spacing (>= 44px).
- **Tablet (768px)**: iPad portrait, 2-column service/schema grid, expanded navigation header.
- **Desktop (1280px+)**: Full widescreen layout, side-by-side management overview, documentation explorer.
