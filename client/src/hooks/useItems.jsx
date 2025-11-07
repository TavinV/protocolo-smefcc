/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from 'react';
import useApi from './useApi';

const useItems = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { loading, error, makeRequest, clearError } = useApi();

  // Listar todos os itens
  const fetchItems = async () => {
    try {
      const data = await makeRequest('get', '/api/items');
      setItems(data.data || []);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Buscar item por ID
  const fetchItemById = async (id) => {
    try {
      const data = await makeRequest('get', `/api/items/${id}`);
      setSelectedItem(data.data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Criar novo item
  const createItem = async (itemData) => {
    try {
      const data = await makeRequest('post', '/api/items', itemData);
      await fetchItems(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Excluir item
  const deleteItem = async (id) => {
    try {
      const data = await makeRequest('delete', `/api/items/${id}`);
      await fetchItems(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Carregar itens ao inicializar
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    selectedItem,
    loading,
    error,
    fetchItems,
    fetchItemById,
    createItem,
    deleteItem,
    clearError,
    setSelectedItem,
  };
};

export default useItems;