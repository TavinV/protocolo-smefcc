import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
      };

      // Só envia corpo se for POST ou PATCH
      if (data && !['get', 'delete'].includes(method.toLowerCase())) {
        config.data = data;
      }

      const response = await axiosInstance(config);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro na requisição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    makeRequest,
    clearError,
  };
};

export default useApi;