# Implementation Log — FrameLearn

This log records verified changes and implementation history. Every entry identifies files modified, requirements addressed, testing status, and clear progression states.

---

## Log Entry 001 — Frontend Foundation & Design System Setup
- **Feature Name**: Milestone 001 — Frontend Foundation & Design System
- **Status**: Committed & Deployed (`https://framelearn.vercel.app/`), Awaiting Lecturer Sign-off
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
- **Outstanding Work**: Formal supervisor review and sign-off.

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
