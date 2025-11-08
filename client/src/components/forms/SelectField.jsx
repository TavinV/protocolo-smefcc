import React from 'react';

const SelectField = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Selecione...",
    error,
    helperText,
    disabled = false,
    required = false,
    className = ""
}) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`
          block w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          sm:text-sm
          ${error
                        ? 'border-red-300 text-red-900'
                        : 'border-gray-300'
                    }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default SelectField;
