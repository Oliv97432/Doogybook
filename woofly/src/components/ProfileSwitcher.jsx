import React, { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';
import Image from './AppImage';

const ProfileSwitcher = ({ profiles = [], currentProfile, onProfileChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleProfileSelect = (profile) => {
    onProfileChange(profile);
    setIsOpen(false);
  };

  const handleKeyDown = (event, profile) => {
    if (event?.key === 'Enter' || event?.key === ' ') {
      event?.preventDefault();
      handleProfileSelect(profile);
    }
  };

  if (!profiles || profiles?.length <= 1) {
    return null;
  }

  return (
    <div className="profile-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-smooth"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Changer de profil de chien"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          {currentProfile?.image ? (
            <Image 
              src={currentProfile?.image} 
              alt={currentProfile?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="Dog" size={20} color="var(--color-primary)" />
          )}
        </div>
        <span className="font-medium text-foreground hidden lg:inline">
          {currentProfile?.name || 'Sélectionner un chien'}
        </span>
        <Icon 
          name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground"
        />
      </button>
      {isOpen && (
        <div className="profile-switcher-dropdown">
          {profiles?.map((profile) => (
            <div
              key={profile?.id}
              onClick={() => handleProfileSelect(profile)}
              onKeyDown={(e) => handleKeyDown(e, profile)}
              className={`profile-switcher-item ${
                currentProfile?.id === profile?.id ? 'bg-muted' : ''
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Sélectionner ${profile?.name}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {profile?.image ? (
                    <Image 
                      src={profile?.image} 
                      alt={profile?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon name="Dog" size={24} color="var(--color-primary)" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {profile?.name}
                  </p>
                  {profile?.breed && (
                    <p className="text-sm text-muted-foreground truncate">
                      {profile?.breed}
                    </p>
                  )}
                </div>
                {currentProfile?.id === profile?.id && (
                  <Icon name="Check" size={20} color="var(--color-primary)" />
                )}
              </div>
            </div>
          ))}
          
          <div className="border-t border-border">
            <div
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/multi-profile-management';
              }}
              onKeyDown={(e) => {
                if (e?.key === 'Enter' || e?.key === ' ') {
                  e?.preventDefault();
                  setIsOpen(false);
                  window.location.href = '/multi-profile-management';
                }
              }}
              className="profile-switcher-item text-primary"
              role="button"
              tabIndex={0}
              aria-label="Gérer tous les profils"
            >
              <div className="flex items-center gap-3">
                <Icon name="Settings" size={20} />
                <span className="font-medium">Gérer les profils</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSwitcher;