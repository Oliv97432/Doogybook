-- Migration: Ajouter les colonnes manquantes à la table dogs
-- Date: 2026-01-17
-- Description: Ajout de foster_family_contact_id et is_published pour gérer les familles d'accueil et la publication des chiens

-- Ajouter la colonne foster_family_contact_id pour lier un chien à une famille d'accueil
ALTER TABLE public.dogs
ADD COLUMN IF NOT EXISTS foster_family_contact_id UUID;

-- Ajouter la contrainte de clé étrangère avec un nom explicite
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'dogs_foster_family_contact_id_fkey'
    ) THEN
        ALTER TABLE public.dogs
        ADD CONSTRAINT dogs_foster_family_contact_id_fkey
        FOREIGN KEY (foster_family_contact_id) REFERENCES public.contacts(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Ajouter la colonne is_published pour contrôler la visibilité publique des chiens
ALTER TABLE public.dogs
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Créer un index sur foster_family_contact_id pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_dogs_foster_family_contact_id
ON public.dogs(foster_family_contact_id);

-- Créer un index sur is_published pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_dogs_is_published
ON public.dogs(is_published);

-- Mettre à jour les chiens existants qui sont is_for_adoption à true pour les publier également
UPDATE public.dogs
SET is_published = true
WHERE is_for_adoption = true AND is_published IS NULL;

-- Commenter les colonnes pour la documentation
COMMENT ON COLUMN public.dogs.foster_family_contact_id IS 'ID du contact (famille d''accueil) qui accueille temporairement le chien';
COMMENT ON COLUMN public.dogs.is_published IS 'Indique si le chien est visible publiquement sur la plateforme';
