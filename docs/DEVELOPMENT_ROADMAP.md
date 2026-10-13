# Development Roadmap — FrameLearn

## Phased Milestone Schedule

This roadmap establishes the formal development cadence for the FrameLearn project. Every milestone boundary operates as an academic review gate; no subsequent milestone begins without supervisor review.

| Milestone | Title | Status | Gate Reviewer | Key Deliverables |
|---|---|---|---|---|
| **001** | **Foundation, Architecture & Design System** | **COMPLETED** | Project Lecturer | Clean TypeScript/Vite setup, Tailwind brand tokens, 14 UI primitives, GitHub Actions CI, unit tests. |
| **001-F** | **Shared Notification Standard & Documentation Hub** | **IMPLEMENTED LOCALLY** | Project Lecturer | Reusable Toast system, Zero-Alert rule, ConfirmDialog, interactive documentation hub in `#design-system`, Markdown exports. |
| **001-P** | **Interactive Portfolio Feature** | **IMPLEMENTED LOCALLY** | Project Lecturer | Category filtering (Portraits, Weddings, Graduation, Outdoor, Birthdays, Products), accessible Lightbox modal, responsive navigation, error fallbacks. |
| **002** | **Authentication & Role Security Foundation** | Scheduled | Project Lecturer | Supabase Auth integration, Client/Learner/Admin profiles, session management, route guards. |
| **003** | **Public Services & Pricing Catalog** | Scheduled | Project Lecturer | Service tier packages, pricing calculations, equipment listings, client FAQ. |
| **004** | **Client Session Booking Engine** | Scheduled | Project Lecturer | Interactive booking calendar, package selection, inquiry submission, photographer notification. |
| **005** | **Private Client Galleries & Proofing** | Scheduled | Project Lecturer | Password/PIN protected gallery access, client favoriting, proofing feedback, download requests. |
| **006** | **Learning Hub & Workshop Platform** | Scheduled | Project Lecturer | Categorized photography guides, workshop materials, downloadable PDF resources. |
| **007** | **Admin & Photographer CRM Dashboard** | Scheduled | Project Lecturer | Comprehensive dashboard for bookings, galleries, client communications, and platform metrics. |
| **008** | **System Integration, E2E Testing & Final Deployment** | Scheduled | Project Lecturer | Full system acceptance testing, performance audits, security sign-off, final capstone presentation. |

---

## Milestone Dependency Flow

```
[Milestone 001: Foundation]
         │
         ▼
[Milestone 001-F: Notifications & Docs Hub]
         │
         ▼
[Milestone 001-P: Interactive Portfolio]
         │
         ▼
[Gate Review: Milestone 001 Submission]
         │
         ▼
[Milestone 002: Authentication & Roles]
         │
    ┌────┴──────────────────────────┐
    ▼                               ▼
[Milestone 003: Services]   [Milestone 004: Bookings]
    │                               │
    └────┬──────────────────────────┘
         ▼
[Milestone 005: Proofing Galleries]
         │
         ▼
[Milestone 006: Learning Hub]
         │
         ▼
[Milestone 007: Admin Dashboard]
         │
         ▼
[Milestone 008: Final Acceptance Review]
```
