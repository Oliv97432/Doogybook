import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import { useNotifications } from '../hooks/useNotifications';

const NotificationButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleClick = () => {
    navigate('/notifications');
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center justify-center p-2 sm:p-2.5 bg-card border border-border rounded-full hover:bg-muted transition-smooth ${className}`}
      aria-label="Notifications"
    >
      <Icon
        name="Bell"
        size={18}
        className="sm:w-5 sm:h-5 text-foreground"
      />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-background">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationButton;
