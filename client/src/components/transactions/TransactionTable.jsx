import React from 'react';
import { FiRepeat, FiUser, FiPackage, FiCalendar, FiEye } from 'react-icons/fi';
import DataTable from '../ui/DataTable';

const TransactionTable = ({
    transactions,
    loading,
    onViewDetails
}) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (tipo) => {
        return tipo === 'retirada'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-green-100 text-green-800';
    };

    const getStatusText = (tipo) => {
        return tipo === 'retirada' ? 'Retirada' : 'Devolução';
    };

    const transactionColumns = [
        {
            key: 'transacao',
            header: 'Transação',
            render: (item) => (
                <div className="flex items-center">
                    <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${item.tipo === 'retirada' ? 'bg-orange-500' : 'bg-green-500'
                        }`}>
                        <FiRepeat className="text-white text-lg" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {item.item?.codigoInterno || 'Item não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                            ID: {item._id?.substring(0, 8)}...
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
            key: 'tipo',
            header: 'Tipo',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.tipo)}`}>
                    {getStatusText(item.tipo)}
                </span>
            )
        },
        {
            key: 'data',
            header: 'Data/Hora',
            render: (item) => (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiCalendar className="h-4 w-4" />
                    <span>{formatDate(item.createdAt)}</span>
                </div>
            )
        }
    ];

    const customActions = (item) => (
        <button
            onClick={() => onViewDetails(item)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Ver detalhes"
        >
            <FiEye className="h-4 w-4" />
        </button>
    );

    return (
        <DataTable
            data={transactions}
            loading={loading}
            columns={transactionColumns}
            emptyIcon={FiRepeat}
            emptyTitle="Nenhuma transação encontrada"
            emptyDescription="As transações aparecerão aqui automaticamente"
            searchTerm=""
            onSearchChange={null}
            onEdit={null}
            onDelete={null}
            customActions={customActions}
        />
    );
};

export default TransactionTable;