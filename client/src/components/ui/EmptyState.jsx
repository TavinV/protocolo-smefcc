import React from 'react';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="text-center py-8 flex items-center flex-col justify-center">
      <div className="text-4xl text-gray-300 mb-3">{icon}</div>
      <h3 className="text-lg font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
