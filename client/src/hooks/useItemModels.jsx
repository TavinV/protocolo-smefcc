/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from 'react';
import useApi from './useApi';

const useItemModels = () => {
  const [itemModels, setItemModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const { loading, error, makeRequest, clearError } = useApi();

  // Listar todos os modelos
  const fetchItemModels = async () => {
    try {
      const data = await makeRequest('get', '/api/item-models');
      setItemModels(data.data || []);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Buscar modelo por ID
  const fetchModelById = async (id) => {
    try {
      const data = await makeRequest('get', `/api/item-models/${id}`);
      setSelectedModel(data.data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Criar novo modelo
  const createModel = async (modelData) => {
    try {
      const data = await makeRequest('post', '/api/item-models', modelData);
      await fetchItemModels(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Atualizar modelo
  const updateModel = async (id, modelData) => {
    try {
      const data = await makeRequest('patch', `/api/item-models/${id}`, modelData);
      await fetchItemModels(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Excluir modelo
  const deleteModel = async (id) => {
    try {
      const data = await makeRequest('delete', `/api/item-models/${id}`);
      await fetchItemModels(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Carregar modelos ao inicializar
  useEffect(() => {
    fetchItemModels();
  }, []);

  return {
    itemModels,
    selectedModel,
    loading,
    error,
    fetchItemModels,
    fetchModelById,
    createModel,
    updateModel,
    deleteModel,
    clearError,
    setSelectedModel,
  };
};

export default useItemModels;