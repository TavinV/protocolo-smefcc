/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from 'react';
import useApi from './useApi';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { loading, error, makeRequest, clearError } = useApi();

  // Listar todas as transações
  const fetchTransactions = async () => {
    try {
      const data = await makeRequest('get', '/api/transactions');
      setTransactions(data.data || []);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Buscar transação por ID
  const fetchTransactionById = async (id) => {
    try {
      const data = await makeRequest('get', `/api/transactions/${id}`);
      setSelectedTransaction(data.data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Buscar última transação de um item
  const fetchLastTransaction = async (itemId) => {
    try {
      const data = await makeRequest('get', `/api/transactions/last/${itemId}`);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Listar itens atualmente emprestados
  const fetchBorrowedItems = async () => {
    try {
      const data = await makeRequest('get', '/api/transactions/borrowed');
      const borrowed = [data.data]
      setBorrowedItems(borrowed || []);

      return data;
    } catch (err) {
      throw err;
    }
  };

  // Carregar dados ao inicializar
  useEffect(() => {
    fetchTransactions();
    fetchBorrowedItems();
  }, []);

  return {
    transactions,
    borrowedItems,
    selectedTransaction,
    loading,
    error,
    fetchTransactions,
    fetchTransactionById,
    fetchLastTransaction,
    fetchBorrowedItems,
    clearError,
    setSelectedTransaction,
  };
};

export default useTransactions;