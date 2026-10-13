# Technical Architecture — FrameLearn

## 1. Architectural Philosophy
FrameLearn follows a **Feature-Oriented Layered Architecture** built on React, TypeScript, Vite, and Tailwind CSS. The design prioritizes maintainability, strict type safety, modular feature boundaries, and clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│   App Shell, Page Routes, Layouts, Navigation, Design Tokens│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                       FEATURE LAYER                         │
│  Isolated feature boundaries (Portfolio, Services, Booking, │
│  Galleries, Learning, Clients, Dashboard)                   │
│  Each: components/ | hooks/ | types/ | data/                │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    INFRASTRUCTURE LAYER                     │
│  Supabase Client, Toast/Notification Context, Utilities,    │
│  Security Policies, Local Storage Abstractions              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Hierarchy

```
framelearn/
├── docs/                   # Authoritative repository documentation records
├── src/
│   ├── app/                # Application root wiring
│   │   ├── layouts/        # MainLayout (Header, Body, Footer, BackToTop)
│   │   ├── providers/      # AppProvider, ToastContext
│   │   └── routes/         # Top-level route pages (HomePage, Portfolio, DesignSystem)
│   ├── components/         # Shared global components
│   │   ├── layout/         # Container
│   │   ├── media/          # ImageContainer (aspect ratio lock, error fallback)
│   │   ├── navigation/     # Header, Footer, BackToTop
│   │   └── ui/             # 14 primitives + Toast, ToastContainer, ConfirmDialog
│   ├── constants/          # Brand colors, typography, navigation links, project metadata
│   ├── features/           # Modular domain features
│   │   ├── portfolio/      # Interactive gallery, Lightbox, CategoryFilter, data
│   │   ├── auth/           # (Planned M2)
│   │   ├── bookings/       # (Planned M4)
│   │   └── galleries/      # (Planned M5)
│   ├── styles/             # Tailwind directives, theme tokens (theme.css, globals.css)
│   ├── types/              # Global TypeScript interfaces and domain types
│   └── utils/              # Utility helpers (cn class merger)
├── tests/
│   ├── setup.ts            # Jest-dom matchers setup
│   └── unit/               # Vitest unit test suites
└── package.json
```

---

## 3. Component Design & Composition Patterns

1. **Primitive Consistency**: Global UI elements extend standard HTML attributes and use forwardRef where appropriate.
2. **Design Token Encasement**: All components utilize Tailwind classes mapping to CSS custom properties defined in `src/styles/theme.css`.
3. **Graceful Degeneration & Error Boundaries**: Media components (`ImageContainer`) trap image load errors internally and display visual fallback placeholders without crashing parent grids or displaying broken image glyphs.
4. **Accessible Modals & Overlays**: Lightbox and Dialog components manage backdrop clicks, keyboard `Escape` listeners, and scroll lock on `document.body`.
