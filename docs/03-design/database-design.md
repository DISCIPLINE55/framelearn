# Database Design Policy — FrameLearn

## Milestone 001 Database Strategy
In accordance with explicit milestone instructions:
**NO BUSINESS TABLES ARE IMPLEMENTED IN MILESTONE 001.**

Database schema design for business domains (Bookings, Galleries, Lessons, Clients, Services) will be authored, reviewed, and applied during subsequent approved feature milestones.

## High-Level Entity Relationship Plan (Planned for Future Milestones)
- `profiles`: Linked to Supabase Auth (`users`). Stores roles (admin, client, learner).
- `services`: Photography packages and pricing details.
- `bookings`: Client session requests, dates, status tracking.
- `galleries`: Client photo galleries, pin codes, image storage metadata.
- `courses` & `lessons`: Educational content and workshop resources.
