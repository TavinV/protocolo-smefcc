import React from 'react';
import { FiAlertTriangle, FiKey, FiX } from 'react-icons/fi';

const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    selectedUser,
    adminKey,
    onAdminKeyChange
}) => {
    if (!isOpen) return null;

    const isAdmin = selectedUser?.role === 'admin';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                <div className="relative inline-block w-full max-w-md p-6 px-4 pt-5 pb-4 text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                    <div className="flex items-start space-x-3">
                        <div className="shrink-0 p-2 rounded-full bg-red-100 text-red-600">
                            <FiAlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Excluir Usuário
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Tem certeza que deseja excluir {isAdmin ? 'o administrador' : 'o usuário'}
                                <strong> "{selectedUser?.nome}"</strong>? Esta ação não pode ser desfeita.
                            </p>

                            {isAdmin && (
                                <div className="space-y-2 mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        <FiKey className="inline mr-2 h-4 w-4" />
                                        Chave Administrativa <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={adminKey}
                                        onChange={(e) => onAdminKeyChange(e.target.value)}
                                        placeholder="Digite a chave administrativa"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <p className="text-xs text-gray-500">
                                        É necessária uma chave especial para excluir administradores
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isAdmin && !adminKey ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                }`}
                            disabled={isAdmin && !adminKey}
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;