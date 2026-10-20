# Supabase Migrations — FrameLearn

This directory stores version-controlled, additive SQL migration scripts for the FrameLearn PostgreSQL database.

## Migration Principles & Standards
1. **Additive & Non-Destructive**: Never execute `DROP DATABASE`, `DROP SCHEMA`, or destructive table truncations in production.
2. **Explicit Row Level Security (RLS)**: Every user-facing table must have RLS enabled, with policies explicitly partitioning public access vs photographer/admin access.
3. **No Unauthenticated Secret Exposure**: Private client data (PII, phone numbers, booking messages) and administrative tables are strictly shielded behind `is_admin()` checks.
4. **Idempotence**: Scripts use `CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, and safe trigger replacement patterns.

## Migration Inventory

| Migration File | Milestone | Description | Tables Covered |
|---|---|---|---|
| `20261020000001_initial_schema.sql` | Milestone 002 | Core schema foundation, profiles, services, packages, bookings, status audit log, RLS policies, and canonical photography services seed. | `profiles`, `services`, `service_packages`, `booking_requests`, `booking_status_history` |
