import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const NewDiscussionModal = ({ isOpen, onClose, onSubmit, breedName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageSelect = (e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length + selectedImages?.length > 4) {
      alert('Vous pouvez ajouter maximum 4 photos');
      return;
    }
    
    const newImages = files?.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: `Photo ajoutée pour la discussion ${title || 'sans titre'}`
    }));
    
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    URL.revokeObjectURL(newImages?.[index]?.preview);
    newImages?.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleSubmit = () => {
    if (!title?.trim() || !content?.trim()) {
      alert('Veuillez remplir le titre et le contenu');
      return;
    }

    onSubmit({
      title: title?.trim(),
      content: content?.trim(),
      isQuestion,
      images: selectedImages
    });

    setTitle('');
    setContent('');
    setIsQuestion(false);
    setSelectedImages([]);
    onClose();
  };

  const handleClose = () => {
    selectedImages?.forEach(img => URL.revokeObjectURL(img?.preview));
    setTitle('');
    setContent('');
    setIsQuestion(false);
    setSelectedImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Nouvelle discussion - {breedName}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Fermer"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Input
            label="Titre de la discussion"
            type="text"
            placeholder="Ex: Conseils pour l'éducation d'un chiot..."
            value={title}
            onChange={(e) => setTitle(e?.target?.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contenu <span className="text-error">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e?.target?.value)}
              placeholder="Partagez votre expérience, posez une question..."
              className="w-full min-h-[150px] p-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              required
              aria-label="Contenu de la discussion"
            />
          </div>

          <Checkbox
            label="Marquer comme question"
            description="Les autres membres pourront vous aider"
            checked={isQuestion}
            onChange={(e) => setIsQuestion(e?.target?.checked)}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Photos (max 4)
            </label>
            
            {selectedImages?.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                {selectedImages?.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={img?.preview}
                      alt={img?.alt}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center shadow-soft hover:bg-error/90 transition-smooth"
                      aria-label="Supprimer la photo"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedImages?.length < 4 && (
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-smooth">
                <Icon name="ImagePlus" size={20} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Ajouter des photos
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  aria-label="Sélectionner des photos"
                />
              </label>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
          >
            Annuler
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!title?.trim() || !content?.trim()}
          >
            Publier la discussion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewDiscussionModal;