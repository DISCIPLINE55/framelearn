# Security and Privacy Policy — FrameLearn

## 1. Overview
FrameLearn processes sensitive photographic assets, private client proofing selections, and personal appointment details. This document establishes security architecture policies, data privacy guidelines, and defensive programming requirements across all milestones.

---

## 2. Authentication & Authorization (Planned for Milestone 002)

### Row Level Security (RLS)
- Every table created in Supabase PostgreSQL must have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
- Under no circumstances will anonymous clients possess write access to user profiles or private galleries.

### Role-Based Access Control (RBAC)
- **Admin (Photographer)**: Full CRUD access across bookings, galleries, services, and lesson resources.
- **Client**: Access strictly limited to self-booked sessions and private galleries assigned to their authenticated user ID or validated PIN token.
- **Learner**: Access to published courses, free lessons, and subscribed workshop content.

---

## 3. Data Privacy & Image Asset Protection

1. **Private Proofing Galleries**:
   - Private client photographs are never placed in public storage buckets.
   - Presigned download URLs with expiring TTLs will be used for high-resolution asset downloads.
2. **Personal Identifiable Information (PII)**:
   - Client contact details (phone numbers, event locations, payment records) are treated as confidential.
   - PII is never logged to browser console or client-facing error messages.
3. **Zero Secrets in Repository**:
   - All secret credentials, API keys, and service tokens are kept strictly in `.env.local` and ignored via `.gitignore`.
   - Never commit `.env` containing live secrets.

---

## 4. Client-Side Input Sanitization & Defensive Coding

1. **Zero Browser-Native Dialogs**: Eliminates potential UI spoofing or unstyled modal lockups.
2. **XSS Prevention**: React automatically escapes text content. No unvetted usage of `dangerouslySetInnerHTML`.
3. **Honest Operational Feedback**: The UI never claims data has been uploaded, saved, or emailed if a failure or offline state occurs.
