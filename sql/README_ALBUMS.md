# Configuration de la table dog_albums

## Comment créer la table dans Supabase

1. **Connectez-vous à votre projet Supabase**
   - Allez sur https://supabase.com
   - Sélectionnez votre projet Doogybook

2. **Ouvrez l'éditeur SQL**
   - Dans le menu de gauche, cliquez sur "SQL Editor"
   - Cliquez sur "New Query"

3. **Exécutez le script**
   - Copiez tout le contenu du fichier `create_dog_albums_table.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur "Run" pour exécuter le script

4. **Vérification**
   - Allez dans "Table Editor" dans le menu de gauche
   - Vous devriez voir la nouvelle table `dog_albums`

## Structure de la table

La table `dog_albums` stocke les albums photo sous forme de JSON compressé :

```
dog_albums
├── id (UUID) - Identifiant unique de l'album
├── dog_id (UUID) - Référence au chien
├── user_id (UUID) - Référence à l'utilisateur
├── album_data (JSONB) - Données de l'album (voir structure ci-dessous)
├── created_at (TIMESTAMPTZ) - Date de création
└── updated_at (TIMESTAMPTZ) - Date de dernière modification
```

## Structure des données album_data

```json
{
  "pages": [
    {
      "id": "page-1",
      "layout": "fullPage",
      "photos": [
        {
          "id": "photo-uuid",
          "slotIndex": 0,
          "title": "Mon chien adoré 🐕",
          "caption": "Premier jour à la maison",
          "fontFamily": "Arial",
          "fontSize": 14,
          "textColor": "#ffffff"
        }
      ]
    }
  ]
}
```

## Avantages de cette approche

✅ **Économie d'espace** : Seulement les métadonnées sont stockées (IDs, textes, styles), pas les images
✅ **Sauvegarde rapide** : JSON compressé, petite taille
✅ **Flexibilité** : Format JSON permet d'ajouter facilement de nouvelles propriétés
✅ **Sécurité** : RLS activé, chaque utilisateur ne voit que ses albums
✅ **Performance** : Index sur dog_id et user_id pour des requêtes rapides

## Utilisation dans l'application

L'album est automatiquement sauvegardé :
- ✅ Toutes les 2 minutes (sauvegarde auto)
- ✅ Quand l'utilisateur clique sur "Sauvegarder"
- ✅ Au chargement, l'album précédent est restauré

L'utilisateur peut aussi télécharger une copie PDF permanente sur son appareil.
