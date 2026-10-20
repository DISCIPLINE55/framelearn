# Development Roadmap — FrameLearn

## Phased Milestone Schedule

This roadmap establishes the formal development cadence for the FrameLearn project. Every milestone boundary operates as an academic review gate; no subsequent milestone begins without supervisor review.

| Milestone | Title | Status | Gate Reviewer | Key Deliverables |
|---|---|---|---|---|
| **001** | **Foundation, Architecture & Design System** | **COMPLETED & APPROVED** | Project Lecturer | Clean TypeScript/Vite setup, Tailwind brand tokens, 14 UI primitives, GitHub Actions CI, unit tests. Approved by lecturer. |
| **001-F** | **Shared Notification Standard & Documentation Hub** | **COMPLETED & APPROVED** | Project Lecturer | Reusable Toast system, Zero-Alert rule, ConfirmDialog, interactive documentation hub in `#design-system`, Markdown exports. |
| **001-P** | **Interactive Portfolio Feature** | **COMPLETED & APPROVED** | Project Lecturer | Category filtering (Portraits, Weddings, Graduation, Outdoor, Birthdays, Products), accessible Lightbox modal, responsive navigation, error fallbacks. |
| **002** | **Real Backend Foundation & Photographer Access** | **IMPLEMENTED LOCALLY & TESTED** | Project Lecturer | Version-controlled PostgreSQL schema migration (`profiles`, `services`, `service_packages`, `booking_requests`, `booking_status_history`), strict RLS policies, real Supabase auth integration, photographer access portal (`#photographer-portal`), honest environment verification. |
| **003** | **Real Photography Services & Package Management** | Scheduled | Project Lecturer | Canonical service catalog integration, tiered package definitions, pricing configurations, turnaround specifications, client inquiries linkage. |
| **004** | **Client Session Booking Engine** | Scheduled | Project Lecturer | Public booking submission interface without forced account creation, photographer inquiry management, status transition workflow, email notifications. |
| **005** | **Private Client Galleries & Proofing** | Scheduled | Project Lecturer | Secure private gallery delivery, client favoriting, proofing selections, expiring pre-signed URLs, protected storage buckets. |
| **006** | **Learning Hub & Workshop Platform** | Scheduled | Project Lecturer | Categorized photography guides, workshop materials, downloadable PDF resources. |
| **007** | **Admin & Photographer CRM Dashboard** | Scheduled | Project Lecturer | Comprehensive dashboard for bookings, galleries, client communications, and platform metrics. |
| **008** | **System Integration, E2E Testing & Final Deployment** | Scheduled | Project Lecturer | Full system acceptance testing, performance audits, security sign-off, final capstone presentation. |

---

## Milestone Dependency Flow

```
[Milestone 001: Foundation, Notifications & Portfolio]
                         │
                         ▼ (Lecturer Approved)
[Milestone 002: Real Backend Foundation & Photographer Access]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[Milestone 003: Real Services]   [Milestone 004: Booking Engine]
        │                                 │
        └────────────────┬────────────────┘
                         ▼
[Milestone 005: Private Proofing Galleries]
                         │
                         ▼
[Milestone 006: Learning Hub Platform]
                         │
                         ▼
[Milestone 007: Comprehensive CRM Dashboard]
                         │
                         ▼
[Milestone 008: Final Defense & Acceptance Review]
```
