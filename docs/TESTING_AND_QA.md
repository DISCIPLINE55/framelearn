# Testing & Quality Assurance Plan — FrameLearn

## 1. Quality Assurance Strategy
Quality assurance in FrameLearn combines automated unit testing, TypeScript static verification, lint checks, continuous integration, and responsive viewport validation.

### Testing Principles
1. **No Weakened Tests**: Tests reflect actual user interaction requirements and accessibility standards.
2. **Honest Reporting**: Only tests that execute and pass are recorded as passed.
3. **Accessibility Coverage**: Test keyboard interaction, aria attributes, dialog traps, and status announcements.
4. **Regression Prevention**: Automated CI runs on every commit and pull request.

---

## 2. Test Execution Commands

| Command | Tool | Purpose |
|---|---|---|
| `npx vitest run` | Vitest v3 | Executes unit and component tests headlessly. |
| `npm run lint` | TypeScript (`tsc --noEmit`) | Performs strict static type checking with zero emission. |
| `npm run build` | Vite | Validates production bundling, asset chunks, and syntax. |

---

## 3. Verified Test Suite Inventory

### Completed Test Suites
1. `tests/unit/Button.test.tsx`:
   - Validates rendering, variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), disabled state, and loading spinners.
2. `tests/unit/Badge.test.tsx`:
   - Validates badge color tokens, icon slots, and size variants.
3. `tests/unit/SectionHeading.test.tsx`:
   - Validates eyebrow, title, subtitle hierarchy and text alignments.
4. `tests/unit/States.test.tsx`:
   - Validates `LoadingState`, `EmptyState`, and `ErrorState` with retry callbacks.
5. `tests/unit/BackToTop.test.tsx`:
   - Validates scroll threshold appearance and smooth scroll interaction.
6. `tests/unit/Toast.test.tsx` (Milestone 001-F):
   - Validates all 5 toast types (`success`, `error`, `warning`, `info`, `loading`).
   - Validates `aria-live` and `role="alert"` / `role="status"` accessibility announcements.
   - Validates dismiss button and auto-dismiss behavior.
7. `tests/unit/ConfirmDialog.test.tsx` (Milestone 001-F):
   - Validates modal mounting, focus trapping, Escape key cancellation, and confirm/cancel events.
8. `tests/unit/Portfolio.test.tsx` (Milestone 001-P):
   - Validates category filtering across 6 photography categories and 'All'.
   - Validates Lightbox open, close, and keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape`).
   - Validates empty state when no items match.
9. `tests/unit/Documentation.test.tsx` (Milestone 001-F):
   - Validates document category navigation, document reading, copy markdown, and export bundle.

---

## 4. Responsive Viewport Test Matrix

All components and routes are verified across the following standard screen sizes:
- **Mobile Small (360px)**: Compact mobile devices, drawer navigation, single-column gallery cards.
- **Mobile Standard (390px)**: iPhone / standard smartphone layout, touch target spacing (>= 44px).
- **Tablet (768px)**: iPad portrait, 2-column gallery grid, expanded navigation header.
- **Desktop (1280px+)**: Full widescreen layout, 3-column portfolio grid, side-by-side documentation explorer.
