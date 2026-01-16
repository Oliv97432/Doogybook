-- Migration: Create contacts_with_current_dogs view
-- Date: 2026-01-17
-- Description: Create a view that joins contacts with their current dogs count and details

-- ============================================================================
-- 1. CREATE VIEW contacts_with_current_dogs
-- ============================================================================

-- Drop the view if it exists
DROP VIEW IF EXISTS public.contacts_with_current_dogs;

-- Create the view
CREATE OR REPLACE VIEW public.contacts_with_current_dogs AS
SELECT
    c.*,
    COUNT(d.id) FILTER (WHERE d.foster_family_contact_id = c.id) as actual_dogs_count,
    COALESCE(
        json_agg(
            json_build_object(
                'id', d.id,
                'name', d.name,
                'breed', d.breed,
                'birth_date', d.birth_date,
                'gender', d.gender,
                'photo_url', d.photo_url,
                'adoption_status', d.adoption_status
            )
            ORDER BY d.created_at DESC
        ) FILTER (WHERE d.id IS NOT NULL),
        '[]'::json
    ) as current_dogs
FROM public.contacts c
LEFT JOIN public.dogs d ON d.foster_family_contact_id = c.id
GROUP BY c.id;

-- Add comment to the view
COMMENT ON VIEW public.contacts_with_current_dogs IS 'Vue qui joint les contacts avec le nombre et les détails de leurs chiens actuels en famille d''accueil';

-- ============================================================================
-- 2. GRANT PERMISSIONS ON THE VIEW
-- ============================================================================

-- Grant select permission to authenticated users
GRANT SELECT ON public.contacts_with_current_dogs TO authenticated;

-- ============================================================================
-- 3. CREATE RLS POLICIES FOR THE VIEW
-- ============================================================================

-- Enable RLS on the view (inherits from contacts table policies)
ALTER VIEW public.contacts_with_current_dogs SET (security_invoker = true);
