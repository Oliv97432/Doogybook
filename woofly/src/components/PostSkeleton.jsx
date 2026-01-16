import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      
      {/* Image placeholder */}
      <div className="h-48 sm:h-64 bg-gray-200 rounded-xl mb-4" />
      
      {/* Actions */}
      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded w-16" />
        <div className="h-8 bg-gray-200 rounded w-16" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
};

export default PostSkeleton;
