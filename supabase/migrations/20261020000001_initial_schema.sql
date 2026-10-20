-- =============================================================================
-- Migration: 20261020000001_initial_schema.sql
-- Description: Core Schema for FrameLearn Photography Platform (Milestone 002)
-- Entities: profiles, services, service_packages, booking_requests, booking_status_history
-- Author: FrameLearn Development Team (Ismail Ibrahim Mensah, Arafat Nabuku Jansu, Janet Antwi)
-- =============================================================================

-- 1. UTILITY FUNCTIONS
-- -----------------------------------------------------------------------------

-- Automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. PROFILES TABLE
-- -----------------------------------------------------------------------------
-- Extends auth.users to store role, display name, and contact details.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'client', 'learner')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles trigger
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Helper function: is_admin()
-- Returns true if current authenticated user has the 'admin' role in profiles.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Automatically populate profile on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Arafat Nabuku Jansu'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. SERVICES TABLE
-- -----------------------------------------------------------------------------
-- Canonical photography disciplines offered by Arafat Nabuku Jansu.
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);

-- 4. SERVICE_PACKAGES TABLE
-- -----------------------------------------------------------------------------
-- Tiered packages for a specific service. One service may have multiple packages.
-- Note: Package details and pricing will be finalized in Milestone 003.
CREATE TABLE IF NOT EXISTS public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price_amount NUMERIC(10, 2),
  currency TEXT NOT NULL DEFAULT 'GHS',
  duration_minutes INTEGER,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_service_package_slug UNIQUE (service_id, slug)
);

DROP TRIGGER IF EXISTS set_service_packages_updated_at ON public.service_packages;
CREATE TRIGGER set_service_packages_updated_at
  BEFORE UPDATE ON public.service_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_service_packages_service_id ON public.service_packages(service_id);
CREATE INDEX IF NOT EXISTS idx_service_packages_is_active ON public.service_packages(is_active);

-- 5. BOOKING_REQUESTS TABLE
-- -----------------------------------------------------------------------------
-- Client booking inquiries. Submitted publicly without requiring account creation.
-- Client PII (phone, email, event details) must NEVER be exposed publicly.
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.service_packages(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL CHECK (char_length(trim(client_name)) > 0),
  client_email TEXT NOT NULL CHECK (client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  client_phone TEXT NOT NULL CHECK (char_length(trim(client_phone)) >= 7),
  preferred_date DATE,
  preferred_time TEXT,
  location_notes TEXT,
  message TEXT NOT NULL CHECK (char_length(trim(message)) > 0),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (
    status IN ('submitted', 'under_review', 'confirmed', 'declined', 'completed', 'cancelled')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_booking_requests_updated_at ON public.booking_requests;
CREATE TRIGGER set_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON public.booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON public.booking_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_service_id ON public.booking_requests(service_id);

-- 6. BOOKING_STATUS_HISTORY TABLE
-- -----------------------------------------------------------------------------
-- Immutable audit log of status transitions on booking requests.
CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_request_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_status_history_request ON public.booking_status_history(booking_request_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;

-- 7.1 PROFILES POLICIES
-- Authenticated users can view their own profile; admins can view all profiles
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Authenticated users can update their own non-role profile details; admins can update all
CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- 7.2 SERVICES POLICIES
-- Public (anonymous + authenticated) can view active services
CREATE POLICY "services_select_public"
  ON public.services
  FOR SELECT
  TO public
  USING (is_active = TRUE OR public.is_admin());

-- Only admins can manage (insert, update, delete) services
CREATE POLICY "services_admin_insert"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "services_admin_update"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "services_admin_delete"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7.3 SERVICE_PACKAGES POLICIES
-- Public can view active packages of active services
CREATE POLICY "service_packages_select_public"
  ON public.service_packages
  FOR SELECT
  TO public
  USING (is_active = TRUE OR public.is_admin());

-- Only admins can manage service packages
CREATE POLICY "service_packages_admin_insert"
  ON public.service_packages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "service_packages_admin_update"
  ON public.service_packages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "service_packages_admin_delete"
  ON public.service_packages
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7.4 BOOKING_REQUESTS POLICIES
-- Public visitors can SUBMIT booking inquiries without an account
CREATE POLICY "booking_requests_public_insert"
  ON public.booking_requests
  FOR INSERT
  TO public
  WITH CHECK (
    char_length(trim(client_name)) > 0 AND
    char_length(trim(client_email)) > 0 AND
    char_length(trim(client_phone)) >= 7 AND
    char_length(trim(message)) > 0
  );

-- ONLY photographer/admin can view client booking requests (PII protection)
CREATE POLICY "booking_requests_admin_select"
  ON public.booking_requests
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ONLY photographer/admin can update booking request status
CREATE POLICY "booking_requests_admin_update"
  ON public.booking_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ONLY photographer/admin can delete booking requests
CREATE POLICY "booking_requests_admin_delete"
  ON public.booking_requests
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7.5 BOOKING_STATUS_HISTORY POLICIES
-- ONLY photographer/admin can view and record status transitions
CREATE POLICY "booking_history_admin_select"
  ON public.booking_status_history
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "booking_history_admin_insert"
  ON public.booking_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 8. CANONICAL PHOTOGRAPHY SERVICES SEED (IDEMPOTENT)
-- -----------------------------------------------------------------------------
-- Real service disciplines for Arafat Nabuku Jansu.
-- Pricing details are not invented; they will be defined in Milestone 003.
INSERT INTO public.services (slug, name, category, description, sort_order)
VALUES
  (
    'portrait-photography',
    'Portrait Photography',
    'Portraiture',
    'Professional individual, executive, editorial, and studio portraits focused on personal identity and authentic expression.',
    1
  ),
  (
    'graduation-photography',
    'Graduation Photography',
    'Academic',
    'Milestone celebration coverage capturing academic accomplishments, academic regalia, family portraits, and commemorative moments.',
    2
  ),
  (
    'weddings-and-events',
    'Weddings & Event Photography',
    'Events',
    'Comprehensive documentary and editorial photography for traditional weddings, ceremonies, receptions, and corporate galas.',
    3
  ),
  (
    'outdoor-photography',
    'Outdoor & Landscape Photography',
    'Outdoor',
    'Natural lighting, on-location lifestyle sessions, and environmental storytelling across picturesque locations.',
    4
  ),
  (
    'birthdays-and-celebrations',
    'Birthdays & Celebrations',
    'Events',
    'Vibrant lifestyle coverage for birthday parties, anniversaries, family gatherings, and milestone celebrations.',
    5
  ),
  (
    'product-photography',
    'Product & Commercial Photography',
    'Commercial',
    'High-resolution studio and lifestyle product photography designed for brands, e-commerce stores, and editorial campaigns.',
    6
  ),
  (
    'retouching-and-editing',
    'Photo Editing & Retouching',
    'Creative Services',
    'Professional high-end skin retouching, color grading, exposure balancing, and photographic restoration services.',
    7
  ),
  (
    'photography-training',
    'Photography Training & Workshops',
    'Education',
    'Practical, hands-on photography mentoring, camera mastery sessions, studio lighting instruction, and workflow coaching.',
    8
  )
ON CONFLICT (slug) DO NOTHING;
