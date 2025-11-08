import React from 'react';
import { FiUser, FiRadio, FiSave, FiX } from 'react-icons/fi';

const UserForm = ({
    formData,
    errors,
    isEditing,
    loading,
    onSubmit,
    onCancel,
    onInputChange,
    onShowRfidModal
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiUser className="inline mr-2 h-4 w-4" />
                            Nome completo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => onInputChange('nome', e.target.value)}
                            placeholder="Digite o nome completo"
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.nome ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.nome && (
                            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                        )}
                    </div>

                    {/* CPF */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CPF <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.cpf}
                            onChange={(e) => onInputChange('cpf', e.target.value)}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.cpf ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.cpf && (
                            <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipo de Usuário */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de usuário
                        </label>
                        <select
                            value={formData.role}
                            disabled={true}
                            onChange={(e) => onInputChange('role', e.target.value)}
                            className="block cursor-not-allowed text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="funcionario">Funcionário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {/* RFID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiRadio className="inline mr-2 h-4 w-4" />
                            RFID <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-2 flex-col sm:flex-row sm:space-x-3">
                            <input
                                type="text"
                                value={formData.rfid}
                                onChange={(e) => onInputChange('rfid', e.target.value)}
                                placeholder="Código do RFID"
                                className={`block flex-1 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.rfid ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={onShowRfidModal}
                                className="inline-flex mt-4 sm:mt-0 w-[30%] items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiRadio className="h-4 w-4 mr-2" />
                                RFIDs
                            </button>
                        </div>
                        {errors.rfid && (
                            <p className="mt-1 text-sm text-red-600">{errors.rfid}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Selecione um RFID pendente ou cole manualmente o código
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <FiX className="mr-2 h-4 w-4" />
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <FiSave className="mr-2 h-4 w-4" />
                        {loading ? (
                            <span>{isEditing ? 'Atualizando...' : 'Cadastrando...'}</span>
                        ) : (
                            <span>{isEditing ? 'Atualizar Usuário' : 'Cadastrar Usuário'}</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;