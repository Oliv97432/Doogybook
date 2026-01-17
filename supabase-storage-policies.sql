-- ==========================================
-- 📸 POLICIES STORAGE POUR LE BUCKET 'dog-photos'
-- ==========================================
-- Ce fichier configure les permissions RLS (Row Level Security)
-- pour permettre aux utilisateurs authentifiés d'uploader, voir,
-- modifier et supprimer leurs photos de chiens.
--
-- À exécuter dans: Supabase Dashboard > SQL Editor > New Query
-- ==========================================

-- 1️⃣ POLICY: Permettre aux utilisateurs authentifiés d'UPLOADER des photos
CREATE POLICY "Authenticated users can upload dog photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dog-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2️⃣ POLICY: Permettre à tous de VOIR les photos (bucket PUBLIC)
CREATE POLICY "Anyone can view dog photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'dog-photos');

-- 3️⃣ POLICY: Permettre aux utilisateurs de MODIFIER leurs propres photos
CREATE POLICY "Users can update their own dog photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dog-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'dog-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4️⃣ POLICY: Permettre aux utilisateurs de SUPPRIMER leurs propres photos
CREATE POLICY "Users can delete their own dog photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'dog-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ==========================================
-- ✅ VÉRIFICATION DES POLICIES
-- ==========================================
-- Après exécution, vérifiez que les 4 policies ont été créées:
-- Supabase Dashboard > Storage > dog-photos > Policies
-- Vous devriez voir:
-- - Authenticated users can upload dog photos (INSERT)
-- - Anyone can view dog photos (SELECT)
-- - Users can update their own dog photos (UPDATE)
-- - Users can delete their own dog photos (DELETE)
