import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({
    value,
    onChange,
    onClear,
    placeholder = "Pesquisar...",
    className = ""
}) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {value && (
                <button
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
