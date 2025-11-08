import React from 'react';
import { FiClock, FiUser, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import DataTable from '../ui/DataTable';

const BorrowedItemsList = ({
    borrowedItems,
    loading
}) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const calculateDaysBorrowed = (dateString) => {
        const borrowedDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - borrowedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const borrowedColumns = [
        {
            key: 'item',
            header: 'Item Emprestado',
            render: (item) => (
                <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <FiPackage className="text-white text-lg" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {item.item?.codigoInterno || 'Item não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {item.item?.identificacao || 'Sem identificação'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'usuario',
            header: 'Usuário',
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <FiUser className="text-gray-400 h-4 w-4" />
                    <span className="text-sm text-gray-900">
                        {item.usuario?.nome || 'Usuário não encontrado'}
                    </span>
                </div>
            )
        },
        {
            key: 'data',
            header: 'Data de Retirada',
            render: (item) => (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiClock className="h-4 w-4" />
                    <span>{formatDate(item.createdAt)}</span>
                </div>
            )
        },
        {
            key: 'dias',
            header: 'Dias',
            render: (item) => {
                const days = calculateDaysBorrowed(item.createdAt);
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${days > 7 ? 'bg-red-100 text-red-800' :
                            days > 3 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                        }`}>
                        {days} {days === 1 ? 'dia' : 'dias'}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiClock className="mr-2 text-orange-500" />
                    Itens Atualmente Emprestados
                </h3>
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {borrowedItems.length} itens
                </span>
            </div>

            {borrowedItems.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <FiAlertTriangle className="text-orange-500 text-lg mt-0.5 shrink-0" />
                        <div>
                            <p className="text-orange-800 text-sm font-medium">
                                Acompanhe os itens que estão atualmente emprestados
                            </p>
                            <p className="text-orange-700 text-sm mt-1">
                                Itens em vermelho estão emprestados há mais de 7 dias
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <DataTable
                data={borrowedItems}
                loading={loading}
                columns={borrowedColumns}
                emptyIcon={FiPackage}
                emptyTitle="Nenhum item emprestado no momento"
                emptyDescription="Todos os itens estão disponíveis no inventário"
                searchTerm=""
                onSearchChange={null}
                onEdit={null}
                onDelete={null}
            />
        </div>
    );
};

export default BorrowedItemsList;