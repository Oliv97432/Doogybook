-- ============================================================================
-- DOOGYBOOK - DONNÉES DE TEST POUR INBYOLIVER@GMAIL.COM
-- ============================================================================
-- Ce script ajoute un chien avec des données complètes pour tester l'album photo
-- Utilisateur: inbyoliver@gmail.com
-- Date: 2026-01-17
-- ============================================================================

-- Variables (à adapter selon votre environnement)
-- Récupérer l'UUID de l'utilisateur inbyoliver@gmail.com
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
    -- 1. CRÉER UN CHIEN DE TEST
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
        notes,
        created_at
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
        'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
        'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200',
        'Golden Retriever mâle de couleur dorée. Très affectueux et joueur.',
        NOW()
    )
    RETURNING id INTO v_dog_id;

    RAISE NOTICE 'Chien créé avec ID: %', v_dog_id;

    -- ============================================================================
    -- 2. VACCINATIONS (8 vaccins)
    -- ============================================================================
    INSERT INTO public.vaccinations (dog_id, vaccine_name, vaccination_date, next_due_date, veterinarian, notes) VALUES
    (v_dog_id, 'DHPPi (Maladie de Carré, Hépatite, Parvovirose, Parainfluenza)', '2023-01-15', '2024-01-15', 'Dr. Martin Dubois', 'Rappel annuel - Aucune réaction'),
    (v_dog_id, 'Rage', '2023-01-15', '2026-01-15', 'Dr. Martin Dubois', 'Vaccin triennal - Obligatoire pour voyages'),
    (v_dog_id, 'Leptospirose', '2023-06-10', '2024-06-10', 'Dr. Sophie Laurent', 'Vaccin important pour chiens de plein air'),
    (v_dog_id, 'Toux de chenil (Bordetella)', '2023-09-20', '2024-09-20', 'Dr. Martin Dubois', 'Recommandé avant pension'),
    (v_dog_id, 'Piroplasmose', '2024-03-12', '2025-03-12', 'Dr. Sophie Laurent', 'Protection contre les tiques'),
    (v_dog_id, 'DHPPi (Rappel)', '2024-01-20', '2025-01-20', 'Dr. Martin Dubois', 'Rappel annuel effectué'),
    (v_dog_id, 'Leptospirose (Rappel)', '2024-06-15', '2025-06-15', 'Dr. Sophie Laurent', 'Rappel effectué sans problème'),
    (v_dog_id, 'Leishmaniose', '2024-04-08', '2025-04-08', 'Dr. Martin Dubois', 'Vaccin préventif région Sud');

    RAISE NOTICE '8 vaccinations ajoutées';

    -- ============================================================================
    -- 3. TRAITEMENTS VERMIFUGE (6 traitements)
    -- ============================================================================
    INSERT INTO public.treatments (dog_id, treatment_type, product_name, treatment_date, next_due_date, notes) VALUES
    (v_dog_id, 'worm', 'Milbemax Chien', '2024-01-10', '2024-04-10', 'Vermifuge large spectre - 2 comprimés'),
    (v_dog_id, 'worm', 'Milbemax Chien', '2024-04-12', '2024-07-12', 'Traitement trimestriel'),
    (v_dog_id, 'worm', 'Milbemax Chien', '2024-07-15', '2024-10-15', 'Bien toléré'),
    (v_dog_id, 'worm', 'Milbemax Chien', '2024-10-18', '2025-01-18', 'Traitement régulier'),
    (v_dog_id, 'worm', 'Drontal Plus', '2023-07-20', '2023-10-20', 'Ancien traitement vermifuge'),
    (v_dog_id, 'worm', 'Drontal Plus', '2023-10-22', '2024-01-22', 'Changement de produit ensuite');

    RAISE NOTICE '6 traitements vermifuge ajoutés';

    -- ============================================================================
    -- 4. TRAITEMENTS ANTI-PUCES/TIQUES (8 traitements)
    -- ============================================================================
    INSERT INTO public.treatments (dog_id, treatment_type, product_name, treatment_date, next_due_date, notes) VALUES
    (v_dog_id, 'flea', 'Bravecto (Fluralaner)', '2024-11-05', '2025-02-05', 'Protection 3 mois - Comprimé'),
    (v_dog_id, 'flea', 'Bravecto (Fluralaner)', '2024-08-10', '2024-11-10', 'Très efficace'),
    (v_dog_id, 'flea', 'Bravecto (Fluralaner)', '2024-05-15', '2024-08-15', 'Aucun effet secondaire'),
    (v_dog_id, 'flea', 'Bravecto (Fluralaner)', '2024-02-12', '2024-05-12', 'Traitement bien supporté'),
    (v_dog_id, 'antiparasitaire', 'Frontline Combo', '2023-10-05', '2023-11-05', 'Ancien traitement mensuel'),
    (v_dog_id, 'antiparasitaire', 'Frontline Combo', '2023-09-03', '2023-10-03', 'Application pipette'),
    (v_dog_id, 'flea', 'Advantix', '2023-07-12', '2023-08-12', 'Changement de produit'),
    (v_dog_id, 'flea', 'Advantix', '2023-08-15', '2023-09-15', 'Dernier traitement avant Bravecto');

    RAISE NOTICE '8 traitements anti-puces/tiques ajoutés';

    -- ============================================================================
    -- 5. SUIVI DU POIDS (12 pesées)
    -- ============================================================================
    INSERT INTO public.weight_records (dog_id, weight, measurement_date) VALUES
    (v_dog_id, 12.5, '2020-08-15'),
    (v_dog_id, 18.2, '2020-11-20'),
    (v_dog_id, 22.8, '2021-02-15'),
    (v_dog_id, 26.5, '2021-05-15'),
    (v_dog_id, 28.0, '2021-11-15'),
    (v_dog_id, 28.5, '2022-05-15'),
    (v_dog_id, 29.2, '2022-11-15'),
    (v_dog_id, 28.8, '2023-05-15'),
    (v_dog_id, 28.5, '2023-11-15'),
    (v_dog_id, 28.3, '2024-05-15'),
    (v_dog_id, 28.6, '2024-11-15'),
    (v_dog_id, 28.5, '2025-01-10');

    RAISE NOTICE '12 pesées ajoutées';

    -- ============================================================================
    -- 6. NOTES DE SANTÉ
    -- ============================================================================
    INSERT INTO public.health_notes (dog_id, title, description, tags) VALUES
    (v_dog_id, 'Allergies alimentaires', 'Allergie légère au poulet - Préférer agneau ou poisson. Éviter les céréales.', ARRAY['allergie', 'alimentation']),
    (v_dog_id, 'Dysplasie de la hanche', 'Légère dysplasie détectée en 2023 (grade A/B). Surveillance annuelle recommandée. Aucun traitement nécessaire pour le moment.', ARRAY['articulation', 'suivi']),
    (v_dog_id, 'Contacts d''urgence', 'Clinique Vétérinaire Saint-Martin - Dr. Martin Dubois - 06 12 34 56 78', ARRAY['contact', 'urgence']),
    (v_dog_id, 'Assurance', 'Assurance Animaux Santé - Contrat n°AS-2020-456789 - Formule Premium', ARRAY['assurance']);

    RAISE NOTICE 'Notes de santé ajoutées';

    -- ============================================================================
    -- 7. GALERIE PHOTOS (10 photos)
    -- ============================================================================
    INSERT INTO public.dog_photos (dog_id, photo_url) VALUES
    (v_dog_id, 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800'),
    (v_dog_id, 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800');

    RAISE NOTICE '10 photos ajoutées à la galerie';

    -- ============================================================================
    -- RÉSUMÉ
    -- ============================================================================
    RAISE NOTICE '====================================';
    RAISE NOTICE 'DONNÉES DE TEST CRÉÉES AVEC SUCCÈS';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Utilisateur: inbyoliver@gmail.com';
    RAISE NOTICE 'Chien: Max (Golden Retriever)';
    RAISE NOTICE 'ID du chien: %', v_dog_id;
    RAISE NOTICE '';
    RAISE NOTICE 'Données ajoutées:';
    RAISE NOTICE '- 8 vaccinations';
    RAISE NOTICE '- 6 traitements vermifuge';
    RAISE NOTICE '- 8 traitements anti-puces/tiques';
    RAISE NOTICE '- 12 pesées';
    RAISE NOTICE '- 4 notes de santé';
    RAISE NOTICE '- 10 photos dans la galerie';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'VOUS POUVEZ MAINTENANT TESTER L''ALBUM PHOTO !';
    RAISE NOTICE '====================================';

END $$;
