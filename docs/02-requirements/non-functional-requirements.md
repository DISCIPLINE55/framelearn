# Non-Functional Requirements (NFR)

## 1. Performance & Responsiveness
- First Contentful Paint (FCP) < 1.5s on 4G networks.
- Mobile-first responsive design supporting viewports from 320px to 4K.
- Lazy-loading images with Blur/Skeleton placeholder loading states.

## 2. Accessibility (a11y)
- WCAG 2.1 AA compliance across core colors (#10212B on #EFFBDD ratio is 14.8:1).
- Accessible interactive controls with visible focus rings (`focus-visible:ring-2`).
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`).

## 3. Security Foundation
- Strict environment variable handling (.env never committed).
- Prepared for Supabase Row Level Security (RLS) enforcement in future milestones.
- Input validation sanitization at architectural boundaries.

## 4. Code Quality & Maintainability
- 100% strict mode TypeScript (`noImplicitAny`, `strictNullChecks`).
- Feature-oriented directory organization without monolithic code files.
