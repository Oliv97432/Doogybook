-- Location: supabase/migrations/20251201134356_woofly_auth_module.sql
-- Schema Analysis: Database is empty (FRESH_PROJECT)
-- Integration Type: NEW AUTH MODULE
-- Dependencies: None (first migration)

-- ============================================================================
-- 1. TYPES
-- ============================================================================
CREATE TYPE public.user_role AS ENUM ('owner', 'veterinarian', 'breeder', 'trainer');

-- ============================================================================
-- 2. CORE USER_PROFILES TABLE (PostgREST intermediary)
-- ============================================================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    role public.user_role DEFAULT 'owner'::public.user_role,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_is_active ON public.user_profiles(is_active);

-- ============================================================================
-- 4. FUNCTIONS - MUST COME BEFORE RLS POLICIES
-- ============================================================================

-- Trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    INSERT INTO public.user_profiles (
        id, 
        email, 
        full_name, 
        phone,
        avatar_url,
        bio,
        role,
        location
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.raw_user_meta_data->>'bio', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'owner'::public.user_role),
        COALESCE(NEW.raw_user_meta_data->>'location', '')
    );
    RETURN NEW;
END;
$func$;

-- Updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- ============================================================================
-- 5. ENABLE RLS
-- ============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS POLICIES (Pattern 1: Core User Table - Simple ownership)
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "users_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Users can insert their own profile (for manual profile creation if needed)
CREATE POLICY "users_insert_own_profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Public can view active profiles (for community features)
CREATE POLICY "public_view_active_profiles"
ON public.user_profiles
FOR SELECT
TO public
USING (is_active = true);

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Trigger for automatic profile creation on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at timestamp
CREATE TRIGGER on_user_profile_updated
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. MOCK DATA (Demo User)
-- ============================================================================
DO $$
DECLARE
    demo_user_id UUID := gen_random_uuid();
BEGIN
    -- Create demo auth user with ALL required fields
    INSERT INTO auth.users (
        id, 
        instance_id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        created_at, 
        updated_at, 
        raw_user_meta_data, 
        raw_app_meta_data,
        is_sso_user, 
        is_anonymous, 
        confirmation_token, 
        confirmation_sent_at,
        recovery_token, 
        recovery_sent_at, 
        email_change_token_new, 
        email_change,
        email_change_sent_at, 
        email_change_token_current, 
        email_change_confirm_status,
        reauthentication_token, 
        reauthentication_sent_at, 
        phone, 
        phone_change,
        phone_change_token, 
        phone_change_sent_at
    ) VALUES (
        demo_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'marie.dupont@woofly.fr',
        crypt('Woofly2025!', gen_salt('bf', 10)),
        now(),
        now(),
        now(),
        '{"full_name": "Marie Dupont", "phone": "+33 6 12 34 56 78", "role": "owner", "location": "Paris, France", "bio": "Propriétaire passionnée de Golden Retriever"}'::jsonb,
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        false,
        false,
        '',
        null,
        '',
        null,
        '',
        '',
        null,
        '',
        0,
        '',
        null,
        null,
        '',
        '',
        null
    );

    -- Note: user_profiles row will be created automatically by trigger

END $$;

-- ============================================================================
-- 9. COMMENTS
-- ============================================================================
COMMENT ON TABLE public.user_profiles IS 'User profile information for Woofly dog owner community';
COMMENT ON COLUMN public.user_profiles.role IS 'User role: owner, veterinarian, breeder, or trainer';
COMMENT ON COLUMN public.user_profiles.is_active IS 'Account status - inactive accounts cannot login';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user_profiles record when auth.users record is inserted';