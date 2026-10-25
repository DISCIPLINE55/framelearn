-- =============================================================================
-- FRAMELEARN — CORRECTIVE HARDENING MIGRATION (MILESTONE 002)
-- =============================================================================
-- Migration Name: 20261025000001_m002_corrective_hardening.sql
-- Target Project: htnquutikqahijrtvjsv
-- Author: Ismail Ibrahim Mensah (FrameLearn Engineering)
-- Description: Corrective database hardening:
--   1. Removes first-user promotion and hardcoded email promotions from handle_new_user()
--   2. Enforces least-privilege role assignment (strictly 'client' on public signups)
--   3. Revokes unauthorized function execution from PUBLIC and anon roles
--   4. Adds covering indexes for unindexed foreign keys on booking_requests and booking_status_history
--   5. Consolidates multiple permissive update policies on profiles and optimizes auth.uid() initPlan
--   6. Partitions services and service_packages SELECT policies between anon and authenticated
--   7. Safely registers migration history in supabase_migrations.schema_migrations if table exists
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. HARDEN ADMINISTRATOR PROVISIONING (handle_new_user)
-- -----------------------------------------------------------------------------
-- Public signups unconditionally receive the 'client' role.
-- Both automatic promotion paths (first registered user and hardcoded email) are eliminated.
-- Client-editable user metadata ('role') is completely ignored.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Strict least-privilege principle:
  -- All signups unconditionally receive the 'client' role.
  -- Administrative provisioning must occur through an authorized administrative workflow.
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Client User'),
    'client'
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE
          WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name
          ELSE profiles.full_name
        END;
  RETURN NEW;
END;
$$;

-- Ensure trigger is present on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. HARDEN ROLE PROTECTION TRIGGER (protect_profile_role)
-- -----------------------------------------------------------------------------
-- Enforces that only verified platform administrators can alter user roles.
-- Profile owners cannot change or elevate their own role.
-- Supports direct database maintenance by PostgreSQL superuser / Dashboard SQL Editor
-- and authorized service_role operations while blocking ordinary application requests.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- 1. Allow direct maintenance operations by PostgreSQL superuser / Dashboard operator
    IF session_user IN ('postgres', 'supabase_admin') THEN
      RETURN NEW;
    END IF;

    -- 2. Allow administrative service-role operations (backend / edge functions with service_role key)
    IF (SELECT auth.role()) = 'service_role' THEN
      RETURN NEW;
    END IF;

    -- 3. Allow verified administrator accounts operating through the application
    IF public.is_admin() THEN
      RETURN NEW;
    END IF;

    -- 4. Otherwise, strictly reject unauthorized role modification
    RAISE EXCEPTION 'Security Violation: Only platform administrators can modify user roles.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- -----------------------------------------------------------------------------
-- 3. CONTROLLED ADMINISTRATOR PROVISIONING FUNCTION (assign_admin_role)
-- -----------------------------------------------------------------------------
-- Provides a dedicated administrative procedure for establishing the photographer admin.
-- Revoked from PUBLIC, anon, and authenticated to prevent unauthorized RPC execution.
-- Executable ONLY by postgres (Dashboard SQL Editor) and service_role.
CREATE OR REPLACE FUNCTION public.assign_admin_role(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_updated integer;
BEGIN
  IF target_email IS NULL OR trim(target_email) = '' THEN
    RAISE EXCEPTION 'Target email cannot be empty.';
  END IF;

  UPDATE public.profiles
  SET role = 'admin',
      updated_at = NOW()
  WHERE lower(email) = lower(trim(target_email));

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated = 0 THEN
    RAISE EXCEPTION 'No profile found with email: %', target_email;
  END IF;
END;
$$;

-- -----------------------------------------------------------------------------
-- 4. HARDEN is_admin() FUNCTION
-- -----------------------------------------------------------------------------
-- Authoritative check against verified database profile row.
-- Service-role key callers are recognized as platform administration.
-- Missing or invalid profiles return FALSE.
-- Anonymous visitors (auth.uid() IS NULL) return FALSE.
-- Optimized with (SELECT auth.uid()) to support query planner initPlan caching.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT CASE
    WHEN (SELECT auth.role()) = 'service_role' THEN TRUE
    ELSE COALESCE(
      (
        SELECT role = 'admin'
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
      ),
      FALSE
    )
  END;
$$;

-- -----------------------------------------------------------------------------
-- 4. RESOLVE FUNCTION EXECUTION PERMISSIONS (SECURITY DEFINER FUNCTION ACLs)
-- -----------------------------------------------------------------------------
-- Revoke all execution privileges from PUBLIC and anon for trigger-only functions.
-- handle_new_user is only invoked by Supabase Auth (supabase_auth_admin).
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin, service_role, postgres;

-- protect_profile_role is a trigger on profiles.
-- anon cannot update profiles; authenticated users need trigger execution when updating their own profile.
REVOKE ALL ON FUNCTION public.protect_profile_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_profile_role() FROM anon;
GRANT EXECUTE ON FUNCTION public.protect_profile_role() TO authenticated, service_role, postgres;

-- is_admin is used in RLS policies for authenticated users.
-- Revoke execution from PUBLIC and anon to prevent unnecessary public RPC exposure.
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role, postgres;

-- assign_admin_role is an administrative-only provisioning procedure.
-- Strictly revoke from PUBLIC, anon, and authenticated to prevent unauthorized RPC invocation.
REVOKE ALL ON FUNCTION public.assign_admin_role(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.assign_admin_role(text) FROM anon;
REVOKE ALL ON FUNCTION public.assign_admin_role(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.assign_admin_role(text) TO postgres, service_role;

-- handle_updated_at trigger function
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM anon;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated, service_role, postgres;

-- -----------------------------------------------------------------------------
-- 5. PERFORMANCE ADVISOR: COVERING INDEXES ON FOREIGN KEYS
-- -----------------------------------------------------------------------------
-- Index foreign key public.booking_requests(package_id) -> public.service_packages(id)
CREATE INDEX IF NOT EXISTS idx_booking_requests_package_id
  ON public.booking_requests(package_id);

-- Index foreign key public.booking_status_history(changed_by) -> auth.users(id)
CREATE INDEX IF NOT EXISTS idx_booking_status_history_changed_by
  ON public.booking_status_history(changed_by);

-- -----------------------------------------------------------------------------
-- 6. PERFORMANCE ADVISOR & RLS OPTIMIZATIONS (PROFILES, SERVICES, PACKAGES)
-- -----------------------------------------------------------------------------
-- 6.1 Optimize profiles RLS:
-- Combine permissive update policies (profiles_update_own + profiles_update_admin)
-- into a single consolidated policy to eliminate the multiple permissive policies warning.
-- Wrap auth.uid() in (SELECT auth.uid()) to allow Postgres query planner initPlan caching.
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()) OR public.is_admin())
  WITH CHECK (id = (SELECT auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()) OR public.is_admin());

-- 6.2 Partition services SELECT policy between anon and authenticated
-- This ensures anonymous visitors only evaluate (is_active = TRUE) without needing is_admin() execution.
DROP POLICY IF EXISTS "services_select_public" ON public.services;
DROP POLICY IF EXISTS "services_select_anon" ON public.services;
DROP POLICY IF EXISTS "services_select_authenticated" ON public.services;

CREATE POLICY "services_select_anon"
  ON public.services
  FOR SELECT
  TO anon
  USING (is_active = TRUE);

CREATE POLICY "services_select_authenticated"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

-- 6.3 Partition service_packages SELECT policy between anon and authenticated
DROP POLICY IF EXISTS "service_packages_select_public" ON public.service_packages;
DROP POLICY IF EXISTS "service_packages_select_anon" ON public.service_packages;
DROP POLICY IF EXISTS "service_packages_select_authenticated" ON public.service_packages;

CREATE POLICY "service_packages_select_anon"
  ON public.service_packages
  FOR SELECT
  TO anon
  USING (
    is_active = TRUE AND EXISTS (
      SELECT 1 FROM public.services s
      WHERE s.id = service_packages.service_id
        AND s.is_active = TRUE
    )
  );

CREATE POLICY "service_packages_select_authenticated"
  ON public.service_packages
  FOR SELECT
  TO authenticated
  USING (
    (
      is_active = TRUE AND EXISTS (
        SELECT 1 FROM public.services s
        WHERE s.id = service_packages.service_id
          AND s.is_active = TRUE
      )
    )
    OR public.is_admin()
  );

-- -----------------------------------------------------------------------------
-- 7. SAFE MIGRATION HISTORY RECONCILIATION
-- -----------------------------------------------------------------------------
-- Records both the initial schema (20261020000001) and this corrective migration
-- (20261025000001) into supabase_migrations.schema_migrations if that table exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'supabase_migrations'
      AND table_name = 'schema_migrations'
  ) THEN
    INSERT INTO supabase_migrations.schema_migrations (version)
    VALUES
      ('20261020000001'),
      ('20261025000001')
    ON CONFLICT (version) DO NOTHING;
  END IF;
END;
$$;

-- =============================================================================
-- End of Migration: 20261025000001_m002_corrective_hardening.sql
-- =============================================================================
