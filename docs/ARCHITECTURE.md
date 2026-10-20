# Technical Architecture — FrameLearn

## 1. Architectural Philosophy
FrameLearn follows a **Feature-Oriented Layered Architecture** built on React, TypeScript, Vite, Tailwind CSS, and Supabase. The design prioritizes maintainability, strict type safety, modular feature boundaries, and clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│   App Shell, Page Routes, Protected Routes, MainLayout,      │
│   Header/Footer, Brand Tokens, Design Primitives            │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                       FEATURE LAYER                         │
│  Isolated feature boundaries:                               │
│  - auth/ (Supabase Auth, ProtectedRoute, LoginForm)         │
│  - portfolio/ (Interactive Gallery, Lightbox, Filtering)    │
│  - services/ (Canonical Photography Disciplines)            │
│  - bookings/ (Inquiry Schema, PII Protection)               │
│  - docs/ (Markdown Data Loader & In-App Browser)            │
│  - notifications/ (Branded Toast & ConfirmDialog System)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    INFRASTRUCTURE LAYER                     │
│  Supabase Client (src/lib/database/supabase.ts),            │
│  Database Schema Types (src/types/database.ts),             │
│  Environment Configuration Guard (src/config/env.ts),       │
│  PostgreSQL Migrations & RLS (supabase/migrations/)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Hierarchy

```
framelearn/
├── docs/                   # Authoritative repository documentation records (single source of truth)
├── supabase/               # Backend database configuration & migrations
│   ├── config.toml         # Supabase local environment config
│   └── migrations/         # Version-controlled additive SQL migrations
│       └── 20261020000001_initial_schema.sql
├── src/
│   ├── app/                # Application root wiring
│   │   ├── layouts/        # MainLayout (Header, Body, Footer, BackToTop)
│   │   ├── providers/      # AppProvider, ToastContext, AuthContext
│   │   └── routes/         # Top-level routes (HomePage, Portfolio, PhotographerPortal, DesignSystem)
│   ├── components/         # Shared global components
│   │   ├── layout/         # Container
│   │   ├── media/          # ImageContainer (aspect ratio lock, error fallback)
│   │   ├── navigation/     # Header, Footer, BackToTop
│   │   └── ui/             # 14 primitives + Toast, ToastContainer, ConfirmDialog
│   ├── config/             # Environment validation and Supabase config guards (env.ts)
│   ├── constants/          # Brand colors, typography, navigation links, project metadata
│   ├── features/           # Modular domain features
│   │   ├── auth/           # Real Supabase Auth, AuthContext, ProtectedRoute, LoginForm
│   │   ├── portfolio/      # Interactive gallery, Lightbox, CategoryFilter, data
│   │   ├── services/       # Canonical services registry (prepares for M003)
│   │   ├── bookings/       # Booking inquiries model & RLS rules (prepares for M004)
│   │   └── docs/           # Single-source-of-truth markdown loader & docs viewer
│   ├── lib/
│   │   └── database/       # Supabase client singleton, connection prober, health check
│   ├── styles/             # Tailwind directives, theme tokens (theme.css, globals.css)
│   ├── types/              # Global TypeScript interfaces & PostgreSQL database types
│   └── utils/              # Utility helpers (cn class merger)
├── tests/
│   ├── setup.ts            # Jest-dom matchers setup
│   └── unit/               # 14 Vitest unit test suites (45 tests)
└── package.json
```

---

## 3. Component Design & Composition Patterns

1. **Primitive Consistency**: Global UI elements extend standard HTML attributes and use `forwardRef` where appropriate.
2. **Design Token Encasement**: All components utilize Tailwind classes mapping to CSS custom properties defined in `src/styles/theme.css`.
3. **Graceful Degeneration & Error Boundaries**: Media components (`ImageContainer`) trap image load errors internally and display visual fallback placeholders without crashing parent grids or displaying broken image glyphs.
4. **Accessible Modals & Overlays**: Lightbox and Dialog components manage backdrop clicks, keyboard `Escape` listeners, and scroll lock on `document.body`.
5. **Route Guard & Authorization Pattern**: The `ProtectedRoute` primitive inspects `useAuth()` state. Unauthenticated visitors attempting to view photographer management routes are redirected to the branded `PhotographerLoginForm`.
6. **Zero Browser-Native Alerts**: All operational notifications route through `useToast()` with semantic types (`success`, `error`, `warning`, `info`, `loading`).
