-- Migration: Fix foreign keys and add missing tables
-- Date: 2026-01-17
-- Description: Create placement_history table and fix foreign key relationships

-- ============================================================================
-- 1. CREATE PLACEMENT_HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.placement_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL,
    contact_id UUID,
    professional_account_id UUID,
    placement_type TEXT NOT NULL CHECK (placement_type IN ('foster', 'adoption', 'return')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints with explicit names
ALTER TABLE public.placement_history
DROP CONSTRAINT IF EXISTS placement_history_dog_id_fkey;

ALTER TABLE public.placement_history
ADD CONSTRAINT placement_history_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES public.dogs(id) ON DELETE CASCADE;

ALTER TABLE public.placement_history
DROP CONSTRAINT IF EXISTS placement_history_contact_id_fkey;

ALTER TABLE public.placement_history
ADD CONSTRAINT placement_history_contact_id_fkey
FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE SET NULL;

ALTER TABLE public.placement_history
DROP CONSTRAINT IF EXISTS placement_history_professional_account_id_fkey;

ALTER TABLE public.placement_history
ADD CONSTRAINT placement_history_professional_account_id_fkey
FOREIGN KEY (professional_account_id) REFERENCES public.professional_accounts(id) ON DELETE CASCADE;

-- Indexes for placement_history
CREATE INDEX IF NOT EXISTS idx_placement_history_dog_id ON public.placement_history(dog_id);
CREATE INDEX IF NOT EXISTS idx_placement_history_contact_id ON public.placement_history(contact_id);
CREATE INDEX IF NOT EXISTS idx_placement_history_professional_account_id ON public.placement_history(professional_account_id);
CREATE INDEX IF NOT EXISTS idx_placement_history_status ON public.placement_history(status);
CREATE INDEX IF NOT EXISTS idx_placement_history_start_date ON public.placement_history(start_date DESC);

-- Comments
COMMENT ON TABLE public.placement_history IS 'Historique des placements des chiens (familles d''accueil et adoptions)';
COMMENT ON COLUMN public.placement_history.placement_type IS 'Type de placement: foster (FA), adoption, return (retour)';
COMMENT ON COLUMN public.placement_history.status IS 'Statut: active (en cours), completed (terminé), cancelled (annulé)';

-- ============================================================================
-- 2. FIX NOTIFICATIONS TABLE - ADD ACTOR_ID COLUMN AND FOREIGN KEY
-- ============================================================================

-- Check if notifications table exists and add actor_id properly
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
        -- Add actor_id column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'notifications'
            AND column_name = 'actor_id'
        ) THEN
            ALTER TABLE public.notifications
            ADD COLUMN actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;

        -- Drop existing constraint if it exists (wrong name)
        ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey;

        -- Add proper foreign key constraint (only if column exists but constraint doesn't)
        IF NOT EXISTS (
            SELECT FROM pg_constraint
            WHERE conname = 'notifications_actor_id_fkey'
        ) THEN
            ALTER TABLE public.notifications
            ADD CONSTRAINT notifications_actor_id_fkey
            FOREIGN KEY (actor_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;

        -- Create index if not exists
        CREATE INDEX IF NOT EXISTS idx_notifications_actor_id ON public.notifications(actor_id);
    END IF;
END $$;

-- ============================================================================
-- 3. ENSURE RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Enable RLS on placement_history
ALTER TABLE public.placement_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view placement history of their professional account's dogs
CREATE POLICY "Users can view their professional account placement history"
ON public.placement_history
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.professional_accounts pa
        WHERE pa.id = placement_history.professional_account_id
        AND pa.user_id = auth.uid()
    )
);

-- Policy: Users can insert placement history for their professional account's dogs
CREATE POLICY "Users can create placement history for their dogs"
ON public.placement_history
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.professional_accounts pa
        WHERE pa.id = placement_history.professional_account_id
        AND pa.user_id = auth.uid()
    )
);

-- Policy: Users can update placement history for their professional account's dogs
CREATE POLICY "Users can update their placement history"
ON public.placement_history
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.professional_accounts pa
        WHERE pa.id = placement_history.professional_account_id
        AND pa.user_id = auth.uid()
    )
);

-- Policy: Users can delete placement history for their professional account's dogs
CREATE POLICY "Users can delete their placement history"
ON public.placement_history
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.professional_accounts pa
        WHERE pa.id = placement_history.professional_account_id
        AND pa.user_id = auth.uid()
    )
);

-- ============================================================================
-- 4. CREATE TRIGGER TO AUTO-UPDATE updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_placement_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_placement_history_updated ON public.placement_history;
CREATE TRIGGER on_placement_history_updated
    BEFORE UPDATE ON public.placement_history
    FOR EACH ROW
    EXECUTE FUNCTION public.update_placement_history_updated_at();

-- ============================================================================
-- 5. CREATE INITIAL PLACEMENT HISTORY FROM EXISTING DOGS (OPTIONAL)
-- ============================================================================

-- Note: This section is commented out because it may fail if there are orphaned records.
-- You can manually populate placement_history later if needed.

-- INSERT INTO public.placement_history (dog_id, contact_id, professional_account_id, placement_type, status, start_date)
-- SELECT
--     d.id as dog_id,
--     d.foster_family_contact_id as contact_id,
--     d.professional_account_id,
--     'foster' as placement_type,
--     'active' as status,
--     d.created_at as start_date
-- FROM public.dogs d
-- WHERE d.foster_family_contact_id IS NOT NULL
-- ON CONFLICT DO NOTHING;
