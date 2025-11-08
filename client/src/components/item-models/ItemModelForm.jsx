import React from 'react';
import { FiPackage, FiSave, FiX, FiTag, FiTruck, FiBox } from 'react-icons/fi';

const ItemModelForm = ({
    formData,
    errors,
    isEditing,
    loading,
    onSubmit,
    onCancel,
    onInputChange
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const categorias = [
        { value: 'ferramenta', label: 'Ferramenta' },
        { value: 'EPI', label: 'EPI' },
        { value: 'outros', label: 'Outros' },
        
    ];

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Nome do Modelo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiPackage className="inline mr-2 h-4 w-4" />
                            Nome do Modelo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => onInputChange('nome', e.target.value)}
                            placeholder="Ex: Furadeira Bosch GSR 120-LI"
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.nome ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.nome && (
                            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                        )}
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.descricao}
                            onChange={(e) => onInputChange('descricao', e.target.value)}
                            placeholder="Descreva as características, especificações e funcionalidades do modelo..."
                            rows={3}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.descricao ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.descricao && (
                            <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Categoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiTag className="inline mr-2 h-4 w-4" />
                                Categoria <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.categoria}
                                onChange={(e) => onInputChange('categoria', e.target.value)}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.categoria ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Selecione uma categoria...</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.value} value={categoria.value}>
                                        {categoria.label}
                                    </option>
                                ))}
                            </select>
                            {errors.categoria && (
                                <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
                            )}
                        </div>

                        {/* Fabricante */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiTruck className="inline mr-2 h-4 w-4" />
                                Fabricante <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.fabricante}
                                onChange={(e) => onInputChange('fabricante', e.target.value)}
                                placeholder="Ex: Bosch, Makita, Dell..."
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.fabricante ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.fabricante && (
                                <p className="mt-1 text-sm text-red-600">{errors.fabricante}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantidade Total */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiBox className="inline mr-2 h-4 w-4" />
                                Quantidade Total <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantidadeTotal}
                                onChange={(e) => onInputChange('quantidadeTotal', e.target.value)}
                                placeholder="0"
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.quantidadeTotal ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.quantidadeTotal && (
                                <p className="mt-1 text-sm text-red-600">{errors.quantidadeTotal}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Número total de unidades deste modelo no inventário
                            </p>
                        </div>

                        {/* Quantidade Disponível */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiBox className="inline mr-2 h-4 w-4" />
                                Quantidade Disponível <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                max={formData.quantidadeTotal}
                                value={formData.quantidadeDisponivel}
                                onChange={(e) => onInputChange('quantidadeDisponivel', e.target.value)}
                                placeholder="0"
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.quantidadeDisponivel ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.quantidadeDisponivel && (
                                <p className="mt-1 text-sm text-red-600">{errors.quantidadeDisponivel}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Unidades disponíveis para empréstimo no momento
                            </p>
                        </div>
                    </div>

                    {/* Informação sobre quantidades */}
                    {formData.quantidadeTotal > 0 && formData.quantidadeDisponivel >= 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-800">
                                        Resumo do Estoque
                                    </p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        {formData.quantidadeTotal - formData.quantidadeDisponivel} unidade(s) em uso •
                                        {' '}{formData.quantidadeDisponivel} unidade(s) disponível(is) •
                                        {' '}{formData.quantidadeTotal} unidade(s) no total
                                    </p>
                                </div>
                                {formData.quantidadeDisponivel === 0 && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Esgotado
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
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
                            <span>{isEditing ? 'Atualizar Modelo' : 'Cadastrar Modelo'}</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemModelForm;