import React from 'react';

const Tabs = ({
    activeTab,
    onTabChange,
    tabs,
    className = ""
}) => {
    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <nav className="flex -mb-px">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {tab.icon && <tab.icon className="mr-2 h-5 w-5" />}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                                {tab.count}
                            </span>
                        )}
                        {tab.badge && (
                            <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${tab.badge.variant === 'success' ? 'bg-green-100 text-green-800' :
                                    tab.badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        tab.badge.variant === 'error' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-900'
                                }`}>
                                {tab.badge.text}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;