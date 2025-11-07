import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  color = 'bg-gray-50 border-gray-200',
  loading = false 
}) => {
  return (
    <div className={`${color} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
