-- Table pour sauvegarder les albums photo des chiens (JSON compressé)
-- Cette table stocke seulement les métadonnées et références aux photos, pas les images elles-mêmes
-- Cela permet de minimiser l'espace utilisé dans Supabase

CREATE TABLE IF NOT EXISTS dog_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_id UUID NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  album_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contrainte d'unicité : un seul album par chien
  UNIQUE(dog_id)
);

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_dog_albums_dog_id ON dog_albums(dog_id);
CREATE INDEX IF NOT EXISTS idx_dog_albums_user_id ON dog_albums(user_id);

-- RLS (Row Level Security) pour sécuriser l'accès
ALTER TABLE dog_albums ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leurs propres albums
CREATE POLICY "Users can view their own albums"
  ON dog_albums
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent insérer leurs propres albums
CREATE POLICY "Users can insert their own albums"
  ON dog_albums
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres albums
CREATE POLICY "Users can update their own albums"
  ON dog_albums
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres albums
CREATE POLICY "Users can delete their own albums"
  ON dog_albums
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_dog_albums_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER trigger_update_dog_albums_updated_at
  BEFORE UPDATE ON dog_albums
  FOR EACH ROW
  EXECUTE FUNCTION update_dog_albums_updated_at();

-- Commentaires pour documentation
COMMENT ON TABLE dog_albums IS 'Stocke les albums photo des chiens sous forme de JSON compressé';
COMMENT ON COLUMN dog_albums.album_data IS 'Données de l''album au format JSON : pages, layouts, et références aux photos avec leurs textes';
