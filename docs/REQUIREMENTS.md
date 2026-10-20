# Requirements Specification — FrameLearn

## 1. Functional Requirements (FR)

### Completed Foundation (Milestone 001, 001-F, 001-P)
- **FR-001 Design System Foundation**: The application shall implement a cohesive design token system featuring Primary Navy (`#10212B`), Sage Green (`#8FA464`), and Light Cream (`#EFFBDD`).
- **FR-002 Responsive Application Shell**: The application shall render a persistent Header with navigation, a responsive main container, Back to Top button, and Footer with academic project metadata.
- **FR-003 Reusable UI Primitives**: The system shall provide foundation components (`Button`, `Badge`, `Card`, `Input`, `Textarea`, `Select`, `Modal`, `SectionHeading`, `LoadingState`, `EmptyState`, `ErrorState`, `ImageContainer`, `Container`, `Header`).
- **FR-010 Zero Browser-Native Alerts**: The system shall not invoke `window.alert()`, `window.confirm()`, or `window.prompt()`.
- **FR-011 Multi-Type Toast System**: The notification system shall support `success`, `error`, `warning`, `info`, and `loading` toasts with distinct icons and semantic color cues.
- **FR-012 Honest Feedback**: The system shall only display success feedback after an underlying operation has actually completed successfully.
- **FR-013 Confirmation Dialog**: Consequential or destructive operations shall require explicit confirmation via an accessible branded dialog before execution.
- **FR-020 Category Filtering**: Visitors shall be able to filter portfolio images across defined photography categories (`Portraits`, `Graduation`, `Weddings and Events`, `Outdoor Photography`, `Birthdays and Special Occasions`, `Product Photography`) and reset to `All Categories`.
- **FR-021 Visual Filter Feedback**: The currently active category shall be visually highlighted with high contrast and accessible attributes (`aria-pressed`).
- **FR-022 Image Lightbox Preview**: Selecting any portfolio item shall open a large, responsive preview modal displaying image title, category, description, and metadata.
- **FR-023 Lightbox Navigation**: The lightbox shall support previous/next image navigation via buttons and arrow keys (`ArrowLeft`, `ArrowRight`), and close via `Escape`, close button, or backdrop click.
- **FR-024 Empty and Fallback States**: Categories with zero items or failed images shall render branded `EmptyState` and `ErrorState` components gracefully.

### Completed Backend Foundation & Photographer Access (Milestone 002)
- **FR-100 Supabase Authentication & Session State**: The application shall implement real Supabase authentication with persistent sessions, token refresh listeners, and user state management.
- **FR-101 Protected Photographer Portal**: The system shall provide a protected management gateway (`#photographer-portal`) guarded by `ProtectedRoute`. Unauthenticated visitors shall be redirected to the accessible `PhotographerLoginForm`.
- **FR-102 Production-Ready Database Schema**: The system shall establish an additive, version-controlled PostgreSQL schema defining `profiles`, `services`, `service_packages`, `booking_requests`, and `booking_status_history` with strict Row Level Security (RLS) policies.
- **FR-103 Honest Backend Configuration Guard**: The system shall evaluate backend readiness via `isSupabaseConfigured()`. When environment credentials are not supplied, the platform shall safely withhold remote queries and provide actionable setup notices without faking simulated database success.
- **FR-104 Client PII Protection**: Client booking inquiries shall be insertable by public visitors without account creation, while read, update, and delete capabilities shall be restricted strictly to the authenticated photographer.

### Deferred Functional Modules (Planned Future Milestones)
- **FR-200 Real Services & Package Catalog**: Service tier packages, pricing calculations, deliverables lists, and turnaround specifications *(Milestone 003)*.
- **FR-300 Client Session Booking Engine**: Interactive calendar, date selection, inquiry review dashboard, and status change audit *(Milestone 004)*.
- **FR-400 Private Client Proofing**: Secure PIN-protected client galleries with favorite selections, download requests, and expiring pre-signed URLs *(Milestone 005)*.
- **FR-500 Learning Hub LMS**: Video/article lessons, progress tracking, and downloadable PDF cheat sheets *(Milestone 006)*.
- **FR-600 Comprehensive CRM Dashboard**: End-to-end administration for client relationships, financial metrics, and operational overview *(Milestone 007)*.

---

## 2. Non-Functional Requirements (NFR)

- **NFR-001 Accessibility (WCAG 2.1 AA)**:
  - All text/background combinations shall achieve at least 4.5:1 contrast for normal text and 3:1 for large text.
  - Interactive elements shall possess keyboard focus indicators (`focus-visible`).
  - Screen readers shall be notified of state updates via `aria-live="polite"` or `aria-live="assertive"`.
  - All images shall supply descriptive, non-empty `alt` attributes.
- **NFR-002 Responsive Design**:
  - The application shall provide responsive presentation across viewports: Mobile Small (360px), Mobile Standard (390px), Tablet (768px), and Desktop (1280px+).
- **NFR-003 Performance**:
  - Image containers shall enforce aspect ratio locks to prevent Cumulative Layout Shift (CLS).
  - Images shall use lazy loading (`loading="lazy"`) and skeleton placeholders.
- **NFR-004 Code Quality & Maintainability**:
  - Strict TypeScript with zero `any` types.
  - Automated tests executed via Vitest and static typing via `tsc --noEmit`.
  - Continuous integration verified on every pull request via GitHub Actions.
- **NFR-005 Data Privacy & Security**:
  - No secret keys or service-role credentials exposed in client-side bundles.
  - RLS enforced on all database tables. Client personal contact details shielded from public reads.
