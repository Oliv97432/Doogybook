import React, { useState } from 'react';
import { Type, Palette, ChevronDown, Smile } from 'lucide-react';

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Brush Script MT', label: 'Script' }
];

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48];

const COMMON_EMOJIS = [
  '❤️', '😊', '🐕', '🐶', '🦴', '🎾', '⭐', '🌟', '✨', '💫',
  '🎉', '🎈', '🎀', '💝', '🏆', '👑', '🌈', '☀️', '🌙', '💕',
  '😍', '🥰', '😘', '🤗', '😂', '🤣', '😎', '🥳', '🎂', '🍰'
];

const PhotoTextEditor = ({ photo, pageId, onUpdate, onClose }) => {
  const [title, setTitle] = useState(photo.title || '');
  const [caption, setCaption] = useState(photo.caption || '');
  const [fontFamily, setFontFamily] = useState(photo.fontFamily || 'Arial');
  const [fontSize, setFontSize] = useState(photo.fontSize || 14);
  const [textColor, setTextColor] = useState(photo.textColor || '#000000');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeField, setActiveField] = useState('title'); // 'title' or 'caption'

  const handleSave = () => {
    onUpdate(pageId, photo.slotIndex, {
      title,
      caption,
      fontFamily,
      fontSize,
      textColor
    });
    onClose();
  };

  const insertEmoji = (emoji) => {
    if (activeField === 'title') {
      setTitle(prev => prev + emoji);
    } else {
      setCaption(prev => prev + emoji);
    }
  };

  return (
    <div className="photo-text-editor-overlay" onClick={onClose}>
      <div className="photo-text-editor" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <h3 className="text-lg font-bold text-gray-800">
            ✏️ Ajouter du texte à la photo
          </h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="editor-body">
          {/* Aperçu de la photo */}
          <div className="photo-preview">
            <img src={photo.url} alt="Preview" />
          </div>

          {/* Titre */}
          <div className="form-group">
            <label className="form-label">
              <Type size={16} />
              <span>Titre</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setActiveField('title')}
              placeholder="Ex: Mon chien adoré 🐕"
              className="form-input"
              maxLength={50}
            />
            <span className="char-count">{title.length}/50</span>
          </div>

          {/* Légende */}
          <div className="form-group">
            <label className="form-label">
              <Type size={16} />
              <span>Légende</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onFocus={() => setActiveField('caption')}
              placeholder="Ex: Premier jour à la maison ❤️"
              className="form-textarea"
              rows={3}
              maxLength={150}
            />
            <span className="char-count">{caption.length}/150</span>
          </div>

          {/* Sélecteur d'emojis */}
          <div className="form-group">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="emoji-btn"
            >
              <Smile size={16} />
              <span>Ajouter un emoji</span>
              <ChevronDown size={14} className={showEmojiPicker ? 'rotate-180' : ''} />
            </button>

            {showEmojiPicker && (
              <div className="emoji-picker">
                {COMMON_EMOJIS.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="emoji-option"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Style de texte */}
          <div className="text-style-section">
            <h4 className="section-title">Style du texte</h4>

            <div className="style-grid">
              {/* Police */}
              <div className="form-group">
                <label className="form-label-sm">Police</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="form-select"
                >
                  {FONT_FAMILIES.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taille */}
              <div className="form-group">
                <label className="form-label-sm">Taille</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="form-select"
                >
                  {FONT_SIZES.map(size => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>

              {/* Couleur */}
              <div className="form-group">
                <label className="form-label-sm">
                  <Palette size={14} />
                  <span>Couleur</span>
                </label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{textColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu du texte */}
          <div className="text-preview">
            <p className="preview-label">Aperçu :</p>
            {title && (
              <div
                className="preview-title"
                style={{ fontFamily, fontSize: `${fontSize}px`, color: textColor }}
              >
                {title}
              </div>
            )}
            {caption && (
              <div
                className="preview-caption"
                style={{ fontFamily, fontSize: `${fontSize - 2}px`, color: textColor }}
              >
                {caption}
              </div>
            )}
            {!title && !caption && (
              <p className="preview-empty">Ajoutez un titre ou une légende pour voir l'aperçu</p>
            )}
          </div>
        </div>

        <div className="editor-footer">
          <button onClick={onClose} className="btn-cancel">
            Annuler
          </button>
          <button onClick={handleSave} className="btn-save">
            ✓ Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoTextEditor;
