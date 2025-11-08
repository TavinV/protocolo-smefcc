import React from 'react';
import { FiFilter, FiCalendar, FiUser, FiPackage } from 'react-icons/fi';

const TransactionFilters = ({
    filters,
    onFilterChange,
    onClearFilters
}) => {
    const tiposTransacao = [
        { value: '', label: 'Todos os tipos' },
        { value: 'retirada', label: 'Retiradas' },
        { value: 'devolucao', label: 'Devoluções' }
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-300 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiFilter className="mr-2 text-blue-500" />
                    Filtros
                </h3>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Limpar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipo de Transação */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiPackage className="inline mr-1 h-4 w-4" />
                        Tipo
                    </label>
                    <select
                        value={filters.tipo}
                        onChange={(e) => onFilterChange('tipo', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        {tiposTransacao.map((tipo) => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Período */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiCalendar className="inline mr-1 h-4 w-4" />
                        Período
                    </label>
                    <select
                        value={filters.periodo}
                        onChange={(e) => onFilterChange('periodo', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="hoje">Hoje</option>
                        <option value="semana">Esta semana</option>
                        <option value="mes">Este mês</option>
                        <option value="30dias">Últimos 30 dias</option>
                    </select>
                </div>

                {/* Usuário */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiUser className="inline mr-1 h-4 w-4" />
                        Usuário
                    </label>
                    <input
                        type="text"
                        value={filters.usuario}
                        onChange={(e) => onFilterChange('usuario', e.target.value)}
                        placeholder="Filtrar por usuário..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Item */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiPackage className="inline mr-1 h-4 w-4" />
                        Item
                    </label>
                    <input
                        type="text"
                        value={filters.item}
                        onChange={(e) => onFilterChange('item', e.target.value)}
                        placeholder="Filtrar por item..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionFilters;