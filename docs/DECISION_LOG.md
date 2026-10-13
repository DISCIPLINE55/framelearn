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
  - Minimal CSS footprint in production (`dist/assets/*.css` < 30 kB).
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
