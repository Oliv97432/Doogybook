-- Migration: Ajouter les colonnes manquantes aux tables contacts et adoption_applications
-- Date: 2026-01-17
-- Description: Ajout de availability, current_dogs_count pour contacts et professional_account_id pour adoption_applications

-- ============================================================================
-- 1. TABLE CONTACTS - Ajouter les colonnes manquantes
-- ============================================================================

-- Créer l'enum pour availability si il n'existe pas
DO $$ BEGIN
    CREATE TYPE public.availability_status AS ENUM ('available', 'full', 'unavailable');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ajouter la colonne availability
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS availability public.availability_status DEFAULT 'available';

-- Ajouter la colonne current_dogs_count
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS current_dogs_count INTEGER DEFAULT 0;

-- Créer un index sur availability
CREATE INDEX IF NOT EXISTS idx_contacts_availability
ON public.contacts(availability);

-- Commenter les colonnes
COMMENT ON COLUMN public.contacts.availability IS 'Disponibilité de la famille d''accueil (available, full, unavailable)';
COMMENT ON COLUMN public.contacts.current_dogs_count IS 'Nombre actuel de chiens en famille d''accueil';

-- ============================================================================
-- 2. TABLE ADOPTION_APPLICATIONS - Ajouter professional_account_id
-- ============================================================================

-- Ajouter la colonne professional_account_id
ALTER TABLE public.adoption_applications
ADD COLUMN IF NOT EXISTS professional_account_id UUID REFERENCES public.professional_accounts(id) ON DELETE CASCADE;

-- Créer un index sur professional_account_id
CREATE INDEX IF NOT EXISTS idx_adoption_applications_professional_account_id
ON public.adoption_applications(professional_account_id);

-- Commenter la colonne
COMMENT ON COLUMN public.adoption_applications.professional_account_id IS 'ID du compte professionnel (refuge) concerné par cette candidature';

-- ============================================================================
-- 3. MISE À JOUR DES DONNÉES EXISTANTES
-- ============================================================================

-- Mettre à jour professional_account_id dans adoption_applications
-- en se basant sur le chien de la candidature
UPDATE public.adoption_applications aa
SET professional_account_id = d.professional_account_id
FROM public.dogs d
WHERE aa.dog_id = d.id
  AND aa.professional_account_id IS NULL
  AND d.professional_account_id IS NOT NULL;

-- Mettre à jour current_dogs_count pour les familles d'accueil
-- en comptant les chiens actuellement placés chez elles
UPDATE public.contacts c
SET current_dogs_count = (
    SELECT COUNT(*)
    FROM public.dogs d
    WHERE d.foster_family_contact_id = c.id
)
WHERE c.type IN ('foster_family', 'both');

-- ============================================================================
-- 4. FONCTION TRIGGER POUR MAINTENIR current_dogs_count À JOUR
-- ============================================================================

-- Fonction pour mettre à jour automatiquement le compteur de chiens en FA
CREATE OR REPLACE FUNCTION public.update_contact_dogs_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Si un chien est ajouté à une FA
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.foster_family_contact_id IS NOT NULL THEN
        UPDATE public.contacts
        SET current_dogs_count = (
            SELECT COUNT(*)
            FROM public.dogs
            WHERE foster_family_contact_id = NEW.foster_family_contact_id
        )
        WHERE id = NEW.foster_family_contact_id;
    END IF;

    -- Si un chien est retiré d'une FA
    IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') AND OLD.foster_family_contact_id IS NOT NULL THEN
        UPDATE public.contacts
        SET current_dogs_count = (
            SELECT COUNT(*)
            FROM public.dogs
            WHERE foster_family_contact_id = OLD.foster_family_contact_id
        )
        WHERE id = OLD.foster_family_contact_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger sur la table dogs
DROP TRIGGER IF EXISTS on_dogs_foster_family_changed ON public.dogs;
CREATE TRIGGER on_dogs_foster_family_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.dogs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_contact_dogs_count();

-- ============================================================================
-- 5. METTRE À JOUR LA DISPONIBILITÉ AUTOMATIQUEMENT
-- ============================================================================

-- Fonction pour mettre à jour automatiquement availability en fonction du nombre de chiens
CREATE OR REPLACE FUNCTION public.update_contact_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Si le contact est une famille d'accueil
    IF NEW.type IN ('foster_family', 'both') THEN
        -- Mettre à jour availability en fonction du nombre de chiens et max_dogs
        IF NEW.on_vacation = true THEN
            NEW.availability = 'unavailable';
        ELSIF NEW.max_dogs IS NOT NULL AND NEW.current_dogs_count >= NEW.max_dogs THEN
            NEW.availability = 'full';
        ELSE
            NEW.availability = 'available';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger sur la table contacts
DROP TRIGGER IF EXISTS on_contacts_availability_update ON public.contacts;
CREATE TRIGGER on_contacts_availability_update
    BEFORE INSERT OR UPDATE OF current_dogs_count, max_dogs, on_vacation
    ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_contact_availability();
