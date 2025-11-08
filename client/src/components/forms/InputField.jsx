import React from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

const InputField = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    helperText,
    disabled = false,
    required = false,
    showCopyButton = false,
    onCopy,
    className = ""
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        if (value && onCopy) {
            await onCopy(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
            block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            sm:text-sm
            ${error
                            ? 'border-red-300 text-red-900'
                            : 'border-gray-300'
                        }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
                />

                {showCopyButton && value && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {copied ? (
                            <FiCheck className="h-4 w-4 text-green-500" />
                        ) : (
                            <FiCopy className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default InputField;
