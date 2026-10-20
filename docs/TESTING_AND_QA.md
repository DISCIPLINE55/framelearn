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
| `npx vitest run` | Vitest v3 | Executes unit and component tests headlessly. | **14 test files passed, 45 tests passed** |
| `npm run lint` | TypeScript (`tsc --noEmit`) | Performs strict static type checking with zero emission. | **Exit 0 — zero type errors** |
| `npm run build` | Vite | Validates production bundling, asset chunks, and syntax. | **Success — production build generated** |

---

## 3. Verified Test Suite Inventory (14 Test Suites, 45 Tests)

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

### Backend Foundation & Photographer Access Suites (Milestone 002)
11. `tests/unit/SupabaseClient.test.ts`:
    - Validates credential detection (`isSupabaseConfigured()`) against empty, placeholder, or invalid environment strings.
    - Validates `validateEnv()` warnings in safe unconfigured mode.
    - Validates `checkSupabaseConnection()` returns honest unconfigured status without making unroutable network calls.
12. `tests/unit/Auth.test.tsx`:
    - Validates auth state initialization with unconfigured defaults when no `.env` is present.
    - Validates `PhotographerLoginForm` accessible markup, email/password inputs, and informative setup notice.
    - Validates `signOut()` safely resets local auth session without exceptions.
13. `tests/unit/ProtectedRoute.test.tsx`:
    - Validates unauthenticated visitors are presented with `PhotographerLoginForm`.
    - Validates custom fallback rendering when supplied.
    - Validates authenticated users with `admin` role are granted access to protected workspace children.
14. `tests/unit/PhotographerPortal.test.tsx`:
    - Validates `#photographer-portal` route displays login gate for unauthenticated users.
    - Validates authenticated photographer workspace displays photographer name (Arafat Nabuku Jansu), role badge, and user email.
    - Validates database schema card lists 5 core entities (`profiles`, `services`, `service_packages`, `booking_requests`, `booking_status_history`).
    - Validates all 8 canonical photography services are listed for Milestone 003 readiness.
    - Validates `ConfirmDialog` intercepts logout requests and invokes `signOut()` only upon user confirmation.

---

## 4. Responsive Viewport Test Matrix

All components and routes are verified across the following standard screen sizes:
- **Mobile Small (360px)**: Compact mobile devices, drawer navigation, single-column cards.
- **Mobile Standard (390px)**: iPhone / standard smartphone layout, touch target spacing (>= 44px).
- **Tablet (768px)**: iPad portrait, 2-column service/schema grid, expanded navigation header.
- **Desktop (1280px+)**: Full widescreen layout, side-by-side management overview, documentation explorer.
