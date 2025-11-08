import React, { useState } from 'react';
import { FiAlertTriangle, FiKey } from 'react-icons/fi';
import Modal from './Modal';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar ação",
    message = "Tem certeza que deseja executar esta ação?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "warning",
    requireAdminKey = false
}) => {
    const [adminKey, setAdminKey] = useState('');
    const [keyError, setKeyError] = useState('');

    const handleConfirm = () => {
        if (requireAdminKey) {
            if (adminKey !== 'ADMIN_DELETE_2024') {
                setKeyError('Chave administrativa incorreta');
                return;
            }
        }
        onConfirm();
        setAdminKey('');
        setKeyError('');
    };

    const handleClose = () => {
        onClose();
        setAdminKey('');
        setKeyError('');
    };

    const typeStyles = {
        warning: "bg-yellow-100 text-yellow-600",
        danger: "bg-red-100 text-red-600",
        info: "bg-blue-100 text-blue-600"
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            size="small"
        >
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <div className={`shrink-0 p-2 rounded-full ${typeStyles[type]}`}>
                        <FiAlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-700">{message}</p>
                    </div>
                </div>

                {requireAdminKey && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Chave Administrativa <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiKey className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={adminKey}
                                onChange={(e) => {
                                    setAdminKey(e.target.value);
                                    setKeyError('');
                                }}
                                placeholder="Digite a chave administrativa"
                                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${keyError ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        {keyError && (
                            <p className="text-sm text-red-600">{keyError}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            É necessária uma chave especial para excluir administradores
                        </p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            } ${requireAdminKey && !adminKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={requireAdminKey && !adminKey}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;