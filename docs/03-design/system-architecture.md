# System Architecture — FrameLearn

## Architectural Pattern
FrameLearn uses a **Feature-Oriented Layered Architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│      (App Shell, Pages, Layouts, UI Design System)      │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                      Feature Layer                      │
│    (Auth, Portfolio, Services, Bookings, Galleries,     │
│             Learning, Clients, Dashboard)               │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    Infrastructure Layer                 │
│      (Database Client, Validation, Storage, Security)   │
└─────────────────────────────────────────────────────────┘
```

## Modular Directory Strategy
Each feature folder under `src/features/` will maintain isolated concerns:
- `components/`: Feature-specific UI elements.
- `hooks/`: Feature custom state & data fetching logic.
- `services/`: API / Database query functions.
- `schemas/`: Zod / validation schemas.
- `types/`: Domain TypeScript types.
