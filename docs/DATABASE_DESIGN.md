# Database Design & Schema Policy — FrameLearn

## 1. Milestone Policy & Academic Integrity Notice
In accordance with explicit milestone instructions:
**NO BUSINESS TABLES ARE CREATED OR PERSISTED IN MILESTONE 001 OR 001-P.**

Premature table creation without completed domain modeling or lecturer review is strictly avoided. Database tables for business domains (Bookings, Galleries, Lessons, Clients, Services) will be authored, reviewed, and applied during subsequent approved feature milestones (starting Milestone 002 for authentication and Milestone 004 for bookings).

---

## 2. Infrastructure Client Foundation (Current State)
The Supabase client foundation is configured under `src/lib/supabase.ts` for environment initialization. It reads configuration from Vite environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 3. Planned Entity Relationship Model (Future Milestones)

When authorized in subsequent milestones, the schema will comprise the following normalized relational entities:

### 1. `profiles` (Milestone 002)
- `id`: UUID (Primary Key, foreign key references `auth.users.id`)
- `role`: TEXT ('admin' | 'client' | 'learner')
- `full_name`: TEXT
- `phone`: TEXT (optional)
- `created_at`: TIMESTAMPTZ

### 2. `services` (Milestone 003)
- `id`: UUID (Primary Key)
- `title`: TEXT (e.g., 'Wedding Full Day', 'Studio Portraiture')
- `category`: TEXT
- `price`: NUMERIC
- `duration_minutes`: INTEGER
- `description`: TEXT
- `is_active`: BOOLEAN

### 3. `bookings` (Milestone 004)
- `id`: UUID (Primary Key)
- `client_id`: UUID (FK -> `profiles.id`)
- `service_id`: UUID (FK -> `services.id`)
- `event_date`: DATE
- `start_time`: TIME
- `status`: TEXT ('pending' | 'confirmed' | 'completed' | 'cancelled')
- `special_notes`: TEXT

### 4. `galleries` (Milestone 005)
- `id`: UUID (Primary Key)
- `client_id`: UUID (FK -> `profiles.id`)
- `title`: TEXT
- `pin_code_hash`: TEXT (for password protection)
- `is_published`: BOOLEAN
- `created_at`: TIMESTAMPTZ

### 5. `gallery_photos` (Milestone 005)
- `id`: UUID (Primary Key)
- `gallery_id`: UUID (FK -> `galleries.id`)
- `storage_path`: TEXT
- `aspect_ratio`: TEXT
- `is_favorite`: BOOLEAN
- `sort_order`: INTEGER

### 6. `courses` & `lessons` (Milestone 006)
- Educational modules, lesson markdown/video references, and student workshop downloads.
