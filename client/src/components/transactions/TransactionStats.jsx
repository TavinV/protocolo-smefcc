import React from 'react';
import { FiRepeat, FiPackage, FiUsers, FiTrendingUp } from 'react-icons/fi';

const TransactionStats = ({ transactions, borrowedItems }) => {
    const stats = [
        {
            title: 'Total de Transações',
            value: transactions.length,
            icon: FiRepeat,
            color: 'bg-blue-500',
            description: 'Histórico completo'
        },
        {
            title: 'Itens Emprestados',
            value: borrowedItems.length,
            icon: FiPackage,
            color: 'bg-orange-500',
            description: 'No momento'
        },
        {
            title: 'Retiradas Hoje',
            value: transactions.filter(t =>
                t.tipo === 'retirada' &&
                new Date(t.createdAt).toDateString() === new Date().toDateString()
            ).length,
            icon: FiTrendingUp,
            color: 'bg-green-500',
            description: 'Movimentação diária'
        },
        {
            title: 'Usuários Ativos',
            value: [...new Set(borrowedItems.map(item => item.usuario?._id))].length,
            icon: FiUsers,
            color: 'bg-purple-500',
            description: 'Com itens emprestados'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-300 p-4">
                        <div className="flex items-center">
                            <div className={`p-3 ${stat.color} rounded-lg`}>
                                <Icon className="text-white text-lg" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TransactionStats;