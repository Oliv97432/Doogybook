import React from 'react';

const ConfigPanel = ({ currentPage, selectedLayout, onLayoutChange, onAddPage }) => {
  const layouts = [
    {
      id: 'fullPage',
      name: 'Pleine Page',
      icon: '🖼️',
      description: 'Une grande photo par page',
      preview: (
        <div className="layout-preview">
          <div className="preview-box full"></div>
        </div>
      )
    },
    {
      id: 'twoPerPage',
      name: '2 par Page',
      icon: '📐',
      description: 'Deux photos côte à côte',
      preview: (
        <div className="layout-preview">
          <div className="preview-box half"></div>
          <div className="preview-box half"></div>
        </div>
      )
    },
    {
      id: 'threePerPage',
      name: '3 par Page',
      icon: '🎨',
      description: 'Trois photos (1 grande + 2 petites)',
      preview: (
        <div className="layout-preview three">
          <div className="preview-box large"></div>
          <div className="preview-box-group">
            <div className="preview-box small"></div>
            <div className="preview-box small"></div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="config-panel">
      <div className="panel-header">
        <h2 className="text-xl font-semibold text-gray-800">Configuration</h2>
      </div>

      {/* Mise en page actuelle */}
      <div className="config-section">
        <h3 className="section-title">Page Actuelle</h3>
        <div className="current-page-info">
          <div className="info-row">
            <span className="info-label">Mise en page:</span>
            <span className="info-value">
              {layouts.find(l => l.id === currentPage?.layout)?.name || 'Pleine Page'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Photos:</span>
            <span className="info-value">
              {currentPage?.photos.length || 0} / {getLayoutCapacity(currentPage?.layout)}
            </span>
          </div>
        </div>
      </div>

      {/* Sélection de mise en page */}
      <div className="config-section">
        <h3 className="section-title">Changer la Mise en Page</h3>
        <p className="section-description">
          Modifie la disposition de la page actuelle
        </p>

        <div className="layout-options">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id)}
              className={`layout-option ${selectedLayout === layout.id ? 'active' : ''}`}
              title={layout.description}
            >
              <div className="option-header">
                <span className="option-icon">{layout.icon}</span>
                <span className="option-name">{layout.name}</span>
              </div>
              {layout.preview}
              <p className="option-description">{layout.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Actions de page */}
      <div className="config-section">
        <h3 className="section-title">Actions</h3>

        <button
          onClick={onAddPage}
          className="action-btn add-page"
        >
          ➕ Ajouter une Nouvelle Page
        </button>
      </div>

      {/* Aide */}
      <div className="config-section help-section">
        <h3 className="section-title">Aide</h3>
        <div className="help-content">
          <div className="help-item">
            <span className="help-icon">🖱️</span>
            <span className="help-text">Glissez-déposez pour ajouter des photos</span>
          </div>
          <div className="help-item">
            <span className="help-icon">🔄</span>
            <span className="help-text">Changez la mise en page à tout moment</span>
          </div>
          <div className="help-item">
            <span className="help-icon">📄</span>
            <span className="help-text">Utilisez les miniatures pour réorganiser</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
const getLayoutCapacity = (layout) => {
  switch (layout) {
    case 'fullPage': return 1;
    case 'twoPerPage': return 2;
    case 'threePerPage': return 3;
    default: return 1;
  }
};

export default ConfigPanel;
