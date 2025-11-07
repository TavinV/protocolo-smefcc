import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const RefreshButton = ({ 
  onRefresh, 
  loading = false, 
  size = 'medium',
  className = '' 
}) => {
  const sizes = {
    small: 'p-1 text-sm',
    medium: 'p-2',
    large: 'p-3 text-lg'
  };

  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className={`
        inline-flex items-center justify-center 
        bg-white border border-gray-300 rounded-lg
        text-gray-700 hover:bg-gray-50 hover:text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]} ${className}
      `}
      title="Atualizar dados"
    >
      <FiRefreshCw className={`${loading ? 'animate-spin' : ''} ${size === 'small' ? 'text-base' : 'text-lg'}`} />
      {size !== 'small' && <span className="ml-2">Atualizar</span>}
    </button>
  );
};

export default RefreshButton;
