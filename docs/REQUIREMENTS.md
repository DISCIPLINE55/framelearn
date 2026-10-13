# Requirements Specification — FrameLearn

## 1. Functional Requirements (FR)

### Completed Foundation (Milestone 001)
- **FR-001 Design System Foundation**: The application shall implement a cohesive design token system featuring Primary Navy (`#10212B`), Sage Green (`#8FA464`), and Light Cream (`#EFFBDD`).
- **FR-002 Responsive Application Shell**: The application shall render a persistent Header with navigation, a responsive main container, Back to Top button, and Footer with academic project metadata.
- **FR-003 Reusable UI Primitives**: The system shall provide 14 foundation components (`Button`, `Badge`, `Card`, `Input`, `Textarea`, `Select`, `Modal`, `SectionHeading`, `LoadingState`, `EmptyState`, `ErrorState`, `ImageContainer`, `Container`, `Header`).

### Notification Standard Requirements
- **FR-010 Zero Browser-Native Alerts**: The system shall not invoke `window.alert()`, `window.confirm()`, or `window.prompt()`.
- **FR-011 Multi-Type Toast System**: The notification system shall support `success`, `error`, `warning`, `info`, and `loading` toasts with distinct icons and semantic color cues.
- **FR-012 Honest Feedback**: The system shall only display success feedback after an underlying operation has actually completed successfully.
- **FR-013 Confirmation Dialog**: Consequential or destructive operations shall require explicit confirmation via an accessible branded dialog before execution.

### Interactive Portfolio Requirements
- **FR-020 Category Filtering**: Visitors shall be able to filter portfolio images across defined photography categories (`Portraits`, `Graduation`, `Weddings and Events`, `Outdoor Photography`, `Birthdays and Special Occasions`, `Product Photography`) and reset to `All Categories`.
- **FR-021 Visual Filter Feedback**: The currently active category shall be visually highlighted with high contrast and accessible attributes (`aria-pressed`).
- **FR-022 Image Lightbox Preview**: Selecting any portfolio item shall open a large, responsive preview modal displaying image title, category, description, and metadata.
- **FR-023 Lightbox Navigation**: The lightbox shall support previous/next image navigation via buttons and arrow keys (`ArrowLeft`, `ArrowRight`), and close via `Escape`, close button, or backdrop click.
- **FR-024 Empty and Fallback States**: Categories with zero items or failed images shall render branded `EmptyState` and `ErrorState` components gracefully.

### Deferred Functional Modules (Planned Future Milestones)
- **FR-100 Authentication & Profiles**: Role-based authentication (Admin, Client, Learner) via Supabase Auth *(Milestone 002)*.
- **FR-200 Booking Management**: Session date selection, package selection, and status workflows *(Milestone 004)*.
- **FR-300 Private Client Proofing**: Secure PIN-protected client galleries with favorite selections *(Milestone 005)*.
- **FR-400 Learning Hub LMS**: Video/article lessons, progress tracking, and downloadable PDF cheat sheets *(Milestone 006)*.

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
