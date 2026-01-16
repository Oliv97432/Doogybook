-- Location: supabase/migrations/20260116000000_complete_doogybook_schema.sql
-- Schema Analysis: Complete database schema for Doogybook application
-- Integration Type: COMPLETE SCHEMA (extends auth module)
-- Dependencies: 20251201134356_doogybook_auth_module.sql

-- ============================================================================
-- 1. ADDITIONAL ENUMS
-- ============================================================================

CREATE TYPE public.gender_type AS ENUM ('male', 'female');
CREATE TYPE public.dog_size AS ENUM ('small', 'medium', 'large');
CREATE TYPE public.adoption_status AS ENUM ('available', 'adopted', 'pending');
CREATE TYPE public.organization_type AS ENUM ('refuge', 'foster_network', 'association');
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.transfer_status AS ENUM ('pending', 'completed', 'expired');
CREATE TYPE public.treatment_type AS ENUM ('worm', 'flea', 'antiparasitaire');
CREATE TYPE public.contact_type AS ENUM ('foster_family', 'adopter', 'partner', 'both');
CREATE TYPE public.contact_status AS ENUM ('active', 'inactive');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'premium', 'professional');

-- ============================================================================
-- 2. UPDATE USER_PROFILES TABLE (add missing columns)
-- ============================================================================

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS subscription_tier public.subscription_tier DEFAULT 'free'::public.subscription_tier,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- ============================================================================
-- 3. PROFESSIONAL ACCOUNTS TABLE
-- ============================================================================

CREATE TABLE public.professional_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    organization_type public.organization_type DEFAULT 'refuge'::public.organization_type,
    phone TEXT,
    email TEXT,
    city TEXT,
    postal_code TEXT,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    cover_photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_professional_accounts_user_id ON public.professional_accounts(user_id);
CREATE INDEX idx_professional_accounts_is_active ON public.professional_accounts(is_active);
CREATE INDEX idx_professional_accounts_organization_type ON public.professional_accounts(organization_type);

-- ============================================================================
-- 4. DOGS TABLE
-- ============================================================================

CREATE TABLE public.dogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    professional_account_id UUID REFERENCES public.professional_accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    breed TEXT,
    gender public.gender_type,
    birth_date DATE,
    weight NUMERIC(5,2),
    size public.dog_size,
    is_sterilized BOOLEAN DEFAULT false,
    photo_url TEXT,
    cover_photo_url TEXT,
    microchip_number TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    adoption_status public.adoption_status DEFAULT 'adopted'::public.adoption_status,
    is_for_adoption BOOLEAN DEFAULT false,
    adoption_story TEXT,
    adoption_requirements TEXT,
    adoption_fee NUMERIC(10,2),
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT dogs_owner_check CHECK (
        (user_id IS NOT NULL AND professional_account_id IS NULL) OR
        (user_id IS NULL AND professional_account_id IS NOT NULL)
    )
);

CREATE INDEX idx_dogs_user_id ON public.dogs(user_id);
CREATE INDEX idx_dogs_professional_account_id ON public.dogs(professional_account_id);
CREATE INDEX idx_dogs_is_active ON public.dogs(is_active);
CREATE INDEX idx_dogs_is_for_adoption ON public.dogs(is_for_adoption);
CREATE INDEX idx_dogs_adoption_status ON public.dogs(adoption_status);

-- ============================================================================
-- 5. HEALTH & MEDICAL TABLES
-- ============================================================================

-- Vaccinations
CREATE TABLE public.vaccinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    vaccine_name TEXT NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    veterinarian TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vaccinations_dog_id ON public.vaccinations(dog_id);
CREATE INDEX idx_vaccinations_next_due_date ON public.vaccinations(next_due_date);

-- Treatments (antiparasites, medications)
CREATE TABLE public.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    treatment_type public.treatment_type,
    treatment_date DATE NOT NULL,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_treatments_dog_id ON public.treatments(dog_id);
CREATE INDEX idx_treatments_next_due_date ON public.treatments(next_due_date);

-- Weight Records
CREATE TABLE public.weight_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    weight NUMERIC(5,2) NOT NULL,
    measurement_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weight_records_dog_id ON public.weight_records(dog_id);
CREATE INDEX idx_weight_records_measurement_date ON public.weight_records(measurement_date);

-- Health Notes
CREATE TABLE public.health_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT NOT NULL,
    tags TEXT[],
    note_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_notes_dog_id ON public.health_notes(dog_id);

-- Dog Photos
CREATE TABLE public.dog_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dog_photos_dog_id ON public.dog_photos(dog_id);

-- ============================================================================
-- 6. ADOPTION & TRANSFER TABLES
-- ============================================================================

-- Adoption Applications
CREATE TABLE public.adoption_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.application_status DEFAULT 'pending'::public.application_status,
    application_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_adoption_applications_dog_id ON public.adoption_applications(dog_id);
CREATE INDEX idx_adoption_applications_user_id ON public.adoption_applications(user_id);
CREATE INDEX idx_adoption_applications_status ON public.adoption_applications(status);

-- Pending Transfers
CREATE TABLE public.pending_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    to_email TEXT NOT NULL,
    status public.transfer_status DEFAULT 'pending'::public.transfer_status,
    transfer_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_pending_transfers_dog_id ON public.pending_transfers(dog_id);
CREATE INDEX idx_pending_transfers_from_user_id ON public.pending_transfers(from_user_id);
CREATE INDEX idx_pending_transfers_transfer_token ON public.pending_transfers(transfer_token);
CREATE INDEX idx_pending_transfers_status ON public.pending_transfers(status);

-- ============================================================================
-- 7. COMMUNITY & FORUM TABLES
-- ============================================================================

-- Forums (categories)
CREATE TABLE public.forums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forums_slug ON public.forums(slug);

-- Forum Posts
CREATE TABLE public.forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    forum_id UUID REFERENCES public.forums(id) ON DELETE SET NULL,
    title TEXT,
    content TEXT NOT NULL,
    tags TEXT[],
    video_url TEXT,
    is_short BOOLEAN DEFAULT false,
    video_duration INTEGER,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX idx_forum_posts_is_hidden ON public.forum_posts(is_hidden);
CREATE INDEX idx_forum_posts_created_at ON public.forum_posts(created_at DESC);

-- Forum Post Images
CREATE TABLE public.forum_post_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_post_images_post_id ON public.forum_post_images(post_id);

-- Forum Comments
CREATE TABLE public.forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX idx_forum_comments_user_id ON public.forum_comments(user_id);

-- Forum Likes
CREATE TABLE public.forum_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_forum_likes_post_id ON public.forum_likes(post_id);
CREATE INDEX idx_forum_likes_user_id ON public.forum_likes(user_id);

-- User Follows
CREATE TABLE public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_user_follows_follower_id ON public.user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON public.user_follows(following_id);

-- ============================================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================================
-- 9. PROFESSIONAL CONTACTS TABLE (CRM)
-- ============================================================================

CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_account_id UUID NOT NULL REFERENCES public.professional_accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    type public.contact_type DEFAULT 'adopter'::public.contact_type,
    status public.contact_status DEFAULT 'active'::public.contact_status,
    is_verified BOOLEAN DEFAULT false,
    max_dogs INTEGER,
    on_vacation BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_professional_account_id ON public.contacts(professional_account_id);
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_type ON public.contacts(type);
CREATE INDEX idx_contacts_status ON public.contacts(status);

-- ============================================================================
-- 10. TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER on_professional_accounts_updated
    BEFORE UPDATE ON public.professional_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_dogs_updated
    BEFORE UPDATE ON public.dogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_adoption_applications_updated
    BEFORE UPDATE ON public.adoption_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_forum_posts_updated
    BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_contacts_updated
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.professional_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 12. RLS POLICIES - PROFESSIONAL ACCOUNTS
-- ============================================================================

CREATE POLICY "users_view_own_professional_account"
ON public.professional_accounts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_update_own_professional_account"
ON public.professional_accounts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_insert_own_professional_account"
ON public.professional_accounts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_view_active_professional_accounts"
ON public.professional_accounts
FOR SELECT
TO public
USING (is_active = true);

-- ============================================================================
-- 13. RLS POLICIES - DOGS
-- ============================================================================

CREATE POLICY "users_view_own_dogs"
ON public.dogs
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR
    professional_account_id IN (
        SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
    )
);

CREATE POLICY "users_manage_own_dogs"
ON public.dogs
FOR ALL
TO authenticated
USING (
    user_id = auth.uid() OR
    professional_account_id IN (
        SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    user_id = auth.uid() OR
    professional_account_id IN (
        SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
    )
);

CREATE POLICY "public_view_adoption_dogs"
ON public.dogs
FOR SELECT
TO public
USING (is_for_adoption = true AND is_active = true);

-- ============================================================================
-- 14. RLS POLICIES - HEALTH RECORDS
-- ============================================================================

CREATE POLICY "users_manage_own_dogs_vaccinations"
ON public.vaccinations
FOR ALL
TO authenticated
USING (
    dog_id IN (
        SELECT id FROM public.dogs WHERE user_id = auth.uid() OR
        professional_account_id IN (
            SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "users_manage_own_dogs_treatments"
ON public.treatments
FOR ALL
TO authenticated
USING (
    dog_id IN (
        SELECT id FROM public.dogs WHERE user_id = auth.uid() OR
        professional_account_id IN (
            SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "users_manage_own_dogs_weight_records"
ON public.weight_records
FOR ALL
TO authenticated
USING (
    dog_id IN (
        SELECT id FROM public.dogs WHERE user_id = auth.uid() OR
        professional_account_id IN (
            SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "users_manage_own_dogs_health_notes"
ON public.health_notes
FOR ALL
TO authenticated
USING (
    dog_id IN (
        SELECT id FROM public.dogs WHERE user_id = auth.uid() OR
        professional_account_id IN (
            SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "users_manage_own_dogs_photos"
ON public.dog_photos
FOR ALL
TO authenticated
USING (
    dog_id IN (
        SELECT id FROM public.dogs WHERE user_id = auth.uid() OR
        professional_account_id IN (
            SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
        )
    )
);

-- ============================================================================
-- 15. RLS POLICIES - ADOPTION & TRANSFERS
-- ============================================================================

CREATE POLICY "users_view_adoption_applications"
ON public.adoption_applications
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR
    dog_id IN (
        SELECT id FROM public.dogs WHERE
        professional_account_id IN (
            SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "users_create_adoption_applications"
ON public.adoption_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "professionals_update_adoption_applications"
ON public.adoption_applications
FOR UPDATE
TO authenticated
USING (
    dog_id IN (
        SELECT id FROM public.dogs WHERE
        professional_account_id IN (
            SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "users_manage_own_transfers"
ON public.pending_transfers
FOR ALL
TO authenticated
USING (from_user_id = auth.uid())
WITH CHECK (from_user_id = auth.uid());

-- ============================================================================
-- 16. RLS POLICIES - FORUMS & COMMUNITY
-- ============================================================================

CREATE POLICY "public_view_forums"
ON public.forums
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_view_posts"
ON public.forum_posts
FOR SELECT
TO authenticated
USING (is_hidden = false);

CREATE POLICY "public_view_posts"
ON public.forum_posts
FOR SELECT
TO public
USING (is_hidden = false);

CREATE POLICY "users_manage_own_posts"
ON public.forum_posts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_post_images"
ON public.forum_post_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_post_images"
ON public.forum_post_images
FOR ALL
TO authenticated
USING (
    post_id IN (SELECT id FROM public.forum_posts WHERE user_id = auth.uid())
);

CREATE POLICY "users_view_comments"
ON public.forum_comments
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_comments"
ON public.forum_comments
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_likes"
ON public.forum_likes
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_likes"
ON public.forum_likes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_view_follows"
ON public.user_follows
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "users_manage_own_follows"
ON public.user_follows
FOR ALL
TO authenticated
USING (follower_id = auth.uid())
WITH CHECK (follower_id = auth.uid());

-- ============================================================================
-- 17. RLS POLICIES - NOTIFICATIONS
-- ============================================================================

CREATE POLICY "users_view_own_notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 18. RLS POLICIES - CONTACTS (CRM)
-- ============================================================================

CREATE POLICY "professionals_manage_own_contacts"
ON public.contacts
FOR ALL
TO authenticated
USING (
    professional_account_id IN (
        SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    professional_account_id IN (
        SELECT id FROM public.professional_accounts WHERE user_id = auth.uid()
    )
);

-- ============================================================================
-- 19. COMMENTS
-- ============================================================================

COMMENT ON TABLE public.professional_accounts IS 'Professional accounts for shelters, rescue organizations, and foster networks';
COMMENT ON TABLE public.dogs IS 'Dog profiles - can belong to users or professional accounts';
COMMENT ON TABLE public.vaccinations IS 'Vaccination records for dogs';
COMMENT ON TABLE public.treatments IS 'Parasite treatments and medications for dogs';
COMMENT ON TABLE public.weight_records IS 'Weight tracking history for dogs';
COMMENT ON TABLE public.health_notes IS 'Health-related notes and observations for dogs';
COMMENT ON TABLE public.dog_photos IS 'Photo gallery for dogs';
COMMENT ON TABLE public.adoption_applications IS 'Applications from users to adopt dogs';
COMMENT ON TABLE public.pending_transfers IS 'Dog ownership transfers between users';
COMMENT ON TABLE public.forums IS 'Topic-based forum categories';
COMMENT ON TABLE public.forum_posts IS 'Social feed posts and forum discussions';
COMMENT ON TABLE public.forum_post_images IS 'Images attached to forum posts';
COMMENT ON TABLE public.forum_comments IS 'Comments on forum posts';
COMMENT ON TABLE public.forum_likes IS 'Likes/upvotes on forum posts';
COMMENT ON TABLE public.user_follows IS 'User following relationships';
COMMENT ON TABLE public.notifications IS 'System notifications for users';
COMMENT ON TABLE public.contacts IS 'CRM contacts for professional accounts (foster families, adopters, partners)';
