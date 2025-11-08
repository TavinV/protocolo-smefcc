import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    showCloseButton = true
}) => {
    if (!isOpen) return null;

    const sizes = {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        xlarge: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className={`relative inline-block w-full ${sizes[size]} p-6 px-4 pt-5 pb-4 text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6`}>
                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {title}
                            </h3>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="mt-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;