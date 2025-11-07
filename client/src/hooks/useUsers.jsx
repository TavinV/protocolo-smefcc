/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-catch */
import { useState, useEffect } from 'react';
import useApi from './useApi';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { loading, error, makeRequest, clearError } = useApi();

  // Listar todos os usuários
  const fetchUsers = async () => {
    try {
      const data = await makeRequest('get', '/api/users');
      setUsers(data.data || []);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Buscar usuário por ID
  const fetchUserById = async (id) => {
    try {
      const data = await makeRequest('get', `/api/users/${id}`);
      setSelectedUser(data.data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Criar novo usuário
  const createUser = async (userData) => {
    try {
      const data = await makeRequest('post', '/api/users', userData);
      await fetchUsers(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Atualizar usuário
  const updateUser = async (id, userData) => {
    try {
      const data = await makeRequest('patch', `/api/users/${id}`, userData);
      await fetchUsers(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Vincular RFID ao usuário
  const linkRfid = async (id, rfidData) => {
    try {
      const data = await makeRequest('patch', `/api/users/${id}/rfid`, rfidData);
      await fetchUsers(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Remover RFID do usuário
  const unlinkRfid = async (id) => {
    try {
      const data = await makeRequest('delete', `/api/users/${id}/rfid`);
      await fetchUsers(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Excluir usuário
  const deleteUser = async (id) => {
    try {
      const data = await makeRequest('delete', `/api/users/${id}`);
      await fetchUsers(); // Atualiza a lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Carregar usuários ao inicializar
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    selectedUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    linkRfid,
    unlinkRfid,
    deleteUser,
    clearError,
    setSelectedUser,
  };
};

export default useUsers;