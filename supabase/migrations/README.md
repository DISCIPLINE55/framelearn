# Supabase Migrations — FrameLearn

This directory stores version-controlled, additive SQL migration scripts for the FrameLearn PostgreSQL database.

## Migration Principles & Standards
1. **Additive & Non-Destructive**: Never execute `DROP DATABASE`, `DROP SCHEMA`, or destructive table truncations in production.
2. **Explicit Row Level Security (RLS)**: Every user-facing table must have RLS enabled, with policies explicitly partitioning public access vs photographer/admin access.
3. **No Unauthenticated Secret Exposure**: Private client data (PII, phone numbers, booking messages) and administrative tables are strictly shielded behind `is_admin()` checks.
4. **Idempotence**: Scripts use `CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, and safe trigger replacement patterns.

## Migration Inventory

| Migration File | Milestone | Description | Tables Covered / Entities | Status |
|---|---|---|---|---|
| `20261020000001_initial_schema.sql` | Milestone 002 | Core schema foundation, profiles, services, packages, bookings, status audit log, RLS policies, and canonical photography services seed. | `profiles`, `services`, `service_packages`, `booking_requests`, `booking_status_history` | Live on Supabase (`htnquutikqahijrtvjsv`) |
| `20261025000001_m002_corrective_hardening.sql` | Milestone 002 Corrective | Removes first-user/hardcoded email promotions from `handle_new_user()`, revokes function execute from PUBLIC/anon, adds foreign key covering indexes, resolves RLS initPlan warnings, combines permissive update policies, and reconciles migration history. | `profiles`, `services`, `service_packages`, `booking_requests`, `booking_status_history`, Functions & ACLs | Ready for execution via Supabase SQL Editor |

## Application Procedure & History Reconciliation

### Why CLI Migration Listing Returned No Records
1. The initial schema `20261020000001_initial_schema.sql` was executed directly into the Supabase Dashboard SQL Editor during initial bootstrapping. The SQL Editor executes DDL directly on PostgreSQL without inserting rows into `supabase_migrations.schema_migrations`.
2. The local Supabase CLI token was authenticated under organization `DisciNet org` (`bsrkkbdnkmbkhbvpgxgp`), which lacks administrative Management API privileges for project `htnquutikqahijrtvjsv`.
3. To safely reconcile without dropping tables, resetting the database, or fabricating data:
   - Review the SQL script: `supabase/migrations/20261025000001_m002_corrective_hardening.sql`.
   - Open the Supabase Dashboard SQL Editor: `https://supabase.com/dashboard/project/htnquutikqahijrtvjsv/sql`.
   - Paste and execute `20261025000001_m002_corrective_hardening.sql`.
   - The script automatically registers both `20261020000001` and `20261025000001` into `supabase_migrations.schema_migrations` if that table exists.

### Authorized Photographer Administrator Provisioning Procedure
FrameLearn enforces strict least privilege. The public signup trigger never assigns the `'admin'` role:
1. The photographer creates an account via the photographer login / signup interface or receives an invite from the Supabase Auth Dashboard (`Authentication > Users > Add User`).
2. The trigger `public.handle_new_user()` provisions their profile with the default role `'client'`.
3. An authorized database owner elevates the account to administrator by running a single targeted statement in the Supabase Dashboard SQL Editor:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'photographer-email@framelearn.com';
   ```
4. Never create default administrative accounts with hardcoded passwords.
