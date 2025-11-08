import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar ação",
    message = "Tem certeza que deseja executar esta ação?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "warning"
}) => {
    const typeStyles = {
        warning: "bg-yellow-100 text-yellow-600",
        danger: "bg-red-100 text-red-600",
        info: "bg-blue-100 text-blue-600"
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="small"
        >
            <div className="flex items-start space-x-3">
                <div className={`shrink-0 p-2 rounded-full ${typeStyles[type]}`}>
                    <FiAlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-gray-700">{message}</p>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === 'danger'
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
