/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from 'react';
import useApi from './useApi';

const useRfidPending = () => {
  const [rfidPendings, setRfidPendings] = useState([]);
  const { loading, error, makeRequest, clearError } = useApi();

  // Listar todos os RFIDs pendentes
  const fetchRfidPendings = async () => {
    try {
      const data = await makeRequest('get', '/api/rfid-pending');
      setRfidPendings(data.data || []);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Remover RFID pendente
  const deleteRfidPending = async (id) => {
    try {
      const data = await makeRequest('delete', `/api/rfid-pending/${id}`, null);
      await fetchRfidPendings(); // Atualiza lista após excluir
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Carregar RFIDs pendentes ao inicializar
  useEffect(() => {
    fetchRfidPendings();
  }, []);

  return {
    rfidPendings,
    loading,
    error,
    fetchRfidPendings,
    deleteRfidPending,
    clearError,
  };
};

export default useRfidPending;