-- ============================================================================
-- DOOGYBOOK - CRÉER UN CHIEN AVEC 10 PHOTOS POUR TESTER L'ALBUM
-- ============================================================================
-- Ce script crée uniquement un chien avec 10 photos
-- Toutes les autres données (vaccins, poids, etc.) seront ajoutées via l'interface
-- Utilisateur: inbyoliver@gmail.com
-- Date: 2026-01-17
-- ============================================================================

DO $$
DECLARE
    v_user_id UUID;
    v_dog_id UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'inbyoliver@gmail.com'
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur inbyoliver@gmail.com introuvable';
    END IF;

    -- ============================================================================
    -- 1. CRÉER LE CHIEN
    -- ============================================================================
    INSERT INTO public.dogs (
        user_id,
        name,
        breed,
        gender,
        birth_date,
        weight,
        size,
        microchip_number,
        is_sterilized,
        photo_url,
        cover_photo_url,
        notes
    ) VALUES (
        v_user_id,
        'Max',
        'Golden Retriever',
        'male',
        '2020-05-15',
        28.5,
        'large',
        'FR250269812345678',
        true,
        '/placeholder-dog.jpg',
        '/placeholder-dog-cover.jpg',
        'Golden Retriever mâle de couleur dorée. Très affectueux et joueur.'
    )
    RETURNING id INTO v_dog_id;

    RAISE NOTICE '✅ Chien créé avec ID: %', v_dog_id;

    -- ============================================================================
    -- 2. AJOUTER 10 PHOTOS POUR L'ALBUM
    -- ============================================================================
    -- Note: Remplacez ces placeholders par de vraies photos uploadées via l'interface
    INSERT INTO public.dog_photos (dog_id, photo_url) VALUES
    (v_dog_id, '/placeholder-dog-1.jpg'),
    (v_dog_id, '/placeholder-dog-2.jpg'),
    (v_dog_id, '/placeholder-dog-3.jpg'),
    (v_dog_id, '/placeholder-dog-4.jpg'),
    (v_dog_id, '/placeholder-dog-5.jpg'),
    (v_dog_id, '/placeholder-dog-6.jpg'),
    (v_dog_id, '/placeholder-dog-7.jpg'),
    (v_dog_id, '/placeholder-dog-8.jpg'),
    (v_dog_id, '/placeholder-dog-9.jpg'),
    (v_dog_id, '/placeholder-dog-10.jpg');

    RAISE NOTICE '✅ 10 photos ajoutées à la galerie (placeholders - uploadez de vraies images via l''interface)';

    -- ============================================================================
    -- RÉSUMÉ
    -- ============================================================================
    RAISE NOTICE '';
    RAISE NOTICE '====================================';
    RAISE NOTICE '🎉 CHIEN CRÉÉ AVEC SUCCÈS !';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Utilisateur: inbyoliver@gmail.com';
    RAISE NOTICE 'Chien: Max (Golden Retriever)';
    RAISE NOTICE 'ID du chien: %', v_dog_id;
    RAISE NOTICE '';
    RAISE NOTICE '📸 10 photos ajoutées pour l''album';
    RAISE NOTICE '';
    RAISE NOTICE '💡 PROCHAINES ÉTAPES:';
    RAISE NOTICE '1. Connectez-vous avec inbyoliver@gmail.com';
    RAISE NOTICE '2. Accédez au profil de Max';
    RAISE NOTICE '3. Testez l''album photo (10 photos disponibles)';
    RAISE NOTICE '4. Ajoutez les vaccins, poids, etc. via l''interface';
    RAISE NOTICE '====================================';

END $$;
