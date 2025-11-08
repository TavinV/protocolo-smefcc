/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPackage, FiTool, FiRepeat, FiRadio, FiAlertCircle } from 'react-icons/fi';
import useUsers from '../hooks/useUsers';
import useItemModels from '../hooks/useItemModels';
import useItems from '../hooks/useItems';
import useTransactions from '../hooks/useTransactions';
import useRfidPending from '../hooks/useRfidPending';

// Componentes reutilizáveis
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import RfidPendingList from '../components/dashboard/RfidPendingList';
import RefreshButton from '../components/ui/RefreshButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Hooks para dados
  const { users, fetchUsers, loading: usersLoading } = useUsers();
  const { itemModels, fetchItemModels, loading: modelsLoading } = useItemModels();
  const { items, fetchItems, loading: itemsLoading } = useItems();
  const { 
    transactions, 
    borrowedItems, 
    fetchTransactions, 
    fetchBorrowedItems, 
    loading: transactionsLoading 
  } = useTransactions();
  const { 
    rfidPendings, 
    fetchRfidPendings, 
    deleteRfidPending, 
    loading: rfidLoading 
  } = useRfidPending();

  const [globalLoading, setGlobalLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Carregar todos os dados do dashboard
  const loadDashboardData = async (isRefresh = false) => {
    const notifyCopy = toast.success('Copiado para a área de transferência!', {
      duration: 2000,
      position: 'bottom-right',
    });

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setGlobalLoading(true);
    }

    try {
      await Promise.all([
        fetchUsers(),
        fetchItemModels(),
        fetchItems(),
        fetchTransactions(),
        fetchBorrowedItems(),
        fetchRfidPendings()
      ]);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setGlobalLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handler para deletar RFID pendente
  const handleDeleteRfid = async (rfidId) => {
    try {
      await deleteRfidPending(rfidId);
      // A lista será atualizada automaticamente pelo hook
    } catch (error) {
      console.error('Erro ao deletar RFID:', error);
    }
  };

  // Handler para navegação
  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  const handleViewAllRfid = () => {
    navigate('/rfid-pendings');
  };

  const borrowedCount = Array.isArray(borrowedItems)
    ? borrowedItems.flat().length
    : 0;

  // Estatísticas principais
  const stats = [
    {
      title: 'Usuários Cadastrados',
      value: users.length.toString(),
      icon: <FiUsers className="text-2xl text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      description: 'Total de usuários no sistema'
    },
    {
      title: 'Modelos de Itens',
      value: itemModels.length.toString(),
      icon: <FiPackage className="text-2xl text-green-500" />,
      color: 'bg-green-50 border-green-200',
      description: 'Tipos de equipamentos'
    },
    {
      title: 'Itens Físicos',
      value: items.length.toString(),
      icon: <FiTool className="text-2xl text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      description: 'Unidades disponíveis'
    },
    {
      title: 'Itens Emprestados',
      value: borrowedCount.toString(),
      icon: <FiRepeat className="text-2xl text-orange-500" />,
      color: 'bg-orange-50 border-orange-200',
      description: 'Em uso no momento'
    },
    {
      title: 'RFIDs Pendentes',
      value: rfidPendings.length.toString(),
      icon: <FiRadio className="text-2xl text-red-500" />,
      color: 'bg-red-50 border-red-200',
      description: 'Aguardando vinculação'
    }
  ];

  // Verificar se há algum loading ativo
  const isLoading = globalLoading || usersLoading || modelsLoading || itemsLoading || transactionsLoading || rfidLoading;

  if (globalLoading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner 
          size="large" 
          text="Carregando dashboard..." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com título e botão de atualizar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral do sistema de empréstimos
            {lastUpdate && (
              <span className="text-sm text-gray-500 ml-2">
                • Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
              </span>
            )}
          </p>
        </div>
        
        <RefreshButton
          onRefresh={() => loadDashboardData(true)}
          loading={refreshing}
          size="medium"
        />
      </div>

      {/* Alertas importantes */}
      {rfidPendings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertCircle className="text-yellow-500 text-xl mr-3" />
            <div>
              <p className="text-yellow-800 font-medium">
                {rfidPendings.length} RFID(s) pendente(s) de vinculação
              </p>
              <p className="text-yellow-700 text-sm">
                Clique em "RFIDs Pendentes" no menu para gerenciar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Estatísticas */}
      <StatsGrid 
        stats={stats} 
        loading={isLoading || refreshing}
      />

      {/* Conteúdo Principal - Grid Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Transações */}
        <RecentTransactions
          transactions={transactions}
          loading={transactionsLoading || refreshing}
          onViewAll={handleViewAllTransactions}
        />

        {/* RFIDs Pendentes */}
        <RfidPendingList
          rfidPendings={rfidPendings}
          loading={rfidLoading || refreshing}
          onDelete={handleDeleteRfid}
          onViewAll={handleViewAllRfid}
        />
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg border-gray-300 shadow-md border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/users')}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <FiUsers className="text-blue-500 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-700">Gerenciar Usuários</span>
          </button>
          
          <button 
            onClick={() => navigate('/item-models')}
            className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <FiPackage className="text-green-500 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-700">Modelos de Itens</span>
          </button>
          
          <button 
            onClick={() => navigate('/items')}
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <FiTool className="text-purple-500 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-700">Cadastrar Itens</span>
          </button>
          
          <button 
            onClick={() => navigate('/rfid-pendings')}
            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-center transition-colors duration-200 group"
          >
            <FiRadio className="text-orange-500 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-orange-700">RFIDs Pendentes</span>
          </button>
        </div>
      </div>

      {/* Resumo do Sistema */}
      <div className="bg-gray-50 border-gray-300 shadow-md rounded-lg p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            <p className="text-sm text-gray-600">Usuários Ativos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{items.length}</p>
            <p className="text-sm text-gray-600">Itens no Inventário</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
            <p className="text-sm text-gray-600">Transações Totais</p>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  );
};

export default Dashboard;