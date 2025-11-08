import React from 'react';
import { FiSearch, FiPackage, FiEdit, FiTrash } from 'react-icons/fi';

const DataTable = ({
    data,
    loading,
    columns,
    emptyIcon = FiPackage,
    emptyTitle = "Nenhum item encontrado",
    emptyDescription = "Comece cadastrando o primeiro item",
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Pesquisar...",
    onEdit,
    onDelete,
    customActions
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Carregando...</p>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        const EmptyIcon = emptyIcon;
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                <div className="text-center py-8">
                    <EmptyIcon className="text-4xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">{emptyTitle}</h3>
                    <p className="text-gray-400">{emptyDescription}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Barra de Pesquisa */}
            {onSearchChange && (
                <div className="bg-white rounded-lg border border-gray-300 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="text-sm text-gray-500">
                            {data.length} item(s) encontrado(s)
                        </div>
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.header}
                                    </th>
                                ))}
                                {(onEdit || onDelete || customActions) && (
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={item._id || index} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                            {column.render ? column.render(item) : item[column.key]}
                                        </td>
                                    ))}

                                    {(onEdit || onDelete || customActions) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {customActions && customActions(item)}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <FiEdit className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <FiTrash className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTable;