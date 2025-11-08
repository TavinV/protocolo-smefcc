import React, { useState, useEffect } from 'react';
import { FiRepeat, FiClock, FiEye } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import useTransactions from '../hooks/useTransactions';

// Componentes reutilizáveis
import Tabs from '../components/ui/Tabs';
import TransactionStats from '../components/transactions/TransactionStats';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import BorrowedItemsList from '../components/transactions/BorrowedItemsList';
import TransactionDetails from '../components/transactions/TransactionDetails';

const Transactions = () => {
    const {
        transactions,
        borrowedItems,
        selectedTransaction,
        loading,
        error,
        fetchTransactions,
        fetchTransactionById,
        fetchBorrowedItems,
        clearError,
        setSelectedTransaction
    } = useTransactions();

    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    const [filters, setFilters] = useState({
        tipo: '',
        periodo: '',
        usuario: '',
        item: ''
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            tipo: '',
            periodo: '',
            usuario: '',
            item: ''
        });
        setSearchTerm('');
    };

    const handleViewDetails = async (transaction) => {
        try {
            await fetchTransactionById(transaction._id);
            setShowDetails(true);
        } catch (err) {
            toast.error('Erro ao carregar detalhes da transação');
        }
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedTransaction(null);
    };

    const handleRefresh = async () => {
        try {
            await fetchTransactions();
            await fetchBorrowedItems();
            toast.success('Dados atualizados com sucesso!');
        } catch (err) {
            // Erro tratado pelo hook
        }
    };

    // Aplicar filtros às transações
    const filteredTransactions = transactions.filter(transaction => {
        // Filtro por tipo
        if (filters.tipo && transaction.tipo !== filters.tipo) {
            return false;
        }

        // Filtro por usuário
        if (filters.usuario && !transaction.usuario?.nome?.toLowerCase().includes(filters.usuario.toLowerCase())) {
            return false;
        }

        // Filtro por item
        if (filters.item && !transaction.item?.modelo?.nome?.toLowerCase().includes(filters.item.toLowerCase())) {
            return false;
        }

        // Filtro por período
        if (filters.periodo) {
            const transactionDate = new Date(transaction.createdAt);
            const today = new Date();

            switch (filters.periodo) {
                case 'hoje':
                    if (transactionDate.toDateString() !== today.toDateString()) return false;
                    break;
                case 'semana':
                    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    if (transactionDate < startOfWeek) return false;
                    break;
                case 'mes':
                    if (transactionDate.getMonth() !== today.getMonth() || transactionDate.getFullYear() !== today.getFullYear()) return false;
                    break;
                case '30dias':
                    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
                    if (transactionDate < thirtyDaysAgo) return false;
                    break;
                default:
                    break;
            }
        }


        // Filtro por busca geral
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesItem = transaction.item?.modelo?.nome?.toLowerCase().includes(searchLower);
            const matchesUser = transaction.usuario?.nome?.toLowerCase().includes(searchLower);
            const matchesType = transaction.tipo?.toLowerCase().includes(searchLower);

            if (!matchesItem && !matchesUser && !matchesType) {
                return false;
            }
        }

        return true;
    });

    const tabs = [
        {
            id: 'all',
            label: 'Todas as Transações',
            icon: FiRepeat,
            count: transactions.length
        },
        {
            id: 'borrowed',
            label: 'Itens Emprestados',
            icon: FiClock,
            count: borrowedItems.length
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiRepeat className="mr-3 text-blue-500" />
                        Transações
                    </h1>
                    <p className="text-gray-600">
                        Acompanhe todo o histórico de retiradas e devoluções
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    <FiRepeat className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                </button>
            </div>

            {/* Estatísticas */}
            <TransactionStats
                transactions={transactions}
                borrowedItems={borrowedItems}
            />

            <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
                <Tabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={tabs}
                />

                <div className="p-6">
                    {activeTab === 'all' ? (
                        <div className="space-y-6">
                            {/* Filtros */}
                            <TransactionFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                            />

                            {/* Tabela de Transações */}
                            <TransactionTable
                                transactions={filteredTransactions}
                                loading={loading}
                                onViewDetails={handleViewDetails}
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                searchPlaceholder="Pesquisar por item, usuário ou tipo..."
                            />
                        </div>
                    ) : (
                        /* Lista de Itens Emprestados */
                        <BorrowedItemsList
                            borrowedItems={borrowedItems}
                            loading={loading}
                        />
                    )}
                </div>
            </div>

            {/* Modal de Detalhes */}
            <TransactionDetails
                transaction={selectedTransaction}
                isOpen={showDetails}
                onClose={handleCloseDetails}
            />

            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
};

export default Transactions;