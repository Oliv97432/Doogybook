import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleNewQuestion = () => {
    navigate('/forum-discussion', { state: { action: 'new-post' } });
  };

  const handleBrowsePhotos = () => {
    navigate('/forum-discussion', { state: { filter: 'photos' } });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="default"
        iconName="Plus"
        iconPosition="left"
        onClick={handleNewQuestion}
        className="flex-1"
      >
        Poser une question
      </Button>
      <Button
        variant="outline"
        iconName="Image"
        iconPosition="left"
        onClick={handleBrowsePhotos}
        className="flex-1"
      >
        Parcourir les photos
      </Button>
    </div>
  );
};

export default QuickActions;