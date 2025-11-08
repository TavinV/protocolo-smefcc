import React from 'react';
import { FiRepeat, FiUser, FiTool, FiCalendar } from 'react-icons/fi';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

const RecentTransactions = ({ transactions, loading, onViewAll }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionType = (tipo) => {
    return tipo === 'retirada' ? 'Retirada' : 'Devolução';
  };

  const getTransactionColor = (tipo) => {
    return tipo === 'retirada' 
      ? 'text-orange-600 bg-orange-50 border-orange-200' 
      : 'text-green-600 bg-green-50 border-green-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Últimas Transações
        </h3>
        <LoadingSpinner text="Carregando transações..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Últimas Transações
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver todas
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={<FiRepeat />}
          title="Nenhuma transação"
          description="As transações aparecerão aqui automaticamente"
        />
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getTransactionColor(transaction.tipo)}`}>
                  <FiRepeat className="text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {transaction.item?.codigoInterno || 'Item não encontrado'}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <FiUser className="inline" />
                    <span>{transaction.usuario?.nome || 'Usuário não encontrado'}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.tipo === 'retirada' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {getTransactionType(transaction.tipo)}
                </span>
                <p className="text-xs text-gray-500 flex items-center justify-end space-x-1 mt-1">
                  <FiCalendar className="inline" />
                  <span>{formatDate(transaction.createdAt)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
