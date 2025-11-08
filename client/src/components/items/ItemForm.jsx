import React from 'react';
import { FiTool, FiSave, FiX, FiPackage } from 'react-icons/fi';

const ItemForm = ({
    formData,
    errors,
    itemModels,
    loading,
    onSubmit,
    onCancel,
    onInputChange
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Modelo do Item */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiPackage className="inline mr-2 h-4 w-4" />
                            Modelo do Item <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.modelo}
                            onChange={(e) => onInputChange('modelo', e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.modelo ? 'border-red-300' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Selecione um modelo...</option>
                            {itemModels.map((model) => (
                                <option key={model._id} value={model._id}>
                                    {model.nome}
                                </option>
                            ))}
                        </select>
                        {errors.modelo && (
                            <p className="mt-1 text-sm text-red-600">{errors.modelo}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Selecione o modelo ao qual este item físico pertence
                        </p>
                    </div>

                    {/* Identificação (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiTool className="inline mr-2 h-4 w-4" />
                            Identificação (opcional)
                        </label>
                        <input
                            type="text"
                            value={formData.identificacao}
                            onChange={(e) => onInputChange('identificacao', e.target.value)}
                            placeholder="Ex: Número de série, código interno..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Identificação única para este item físico específico
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
                        {loading ? 'Cadastrando...' : 'Cadastrar Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;