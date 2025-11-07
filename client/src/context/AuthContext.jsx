import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStoredToken, getStoredUser, setStoredAuth, clearStoredAuth, isTokenExpired } from '../utils/auth';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser();
  
      if (token && storedUser && !isTokenExpired(token)) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        clearStoredAuth();
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
  
    checkAuth();
  }, []);

  // Função de login
  const login = async (cpf, senha) => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.post('/api/auth/login', {
        cpf,
        senha
      });

      if (response.data.success) {
        const { token } = response.data.data;

        // Buscando o usuário em GET /users/me

        const getUserResponse = await axiosInstance.get('/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        if (getUserResponse.status != 200){
            const message = getUserResponse?.data?.message || 'Erro ao fazer login. Tente novamente.';
            return {success: false, message}
        }

        // Decodificar o token para obter informações do usuário
        const userData = { ...getUserResponse.data.data};

        setStoredAuth(token, userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, message: 'Login realizado com sucesso!' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    clearStoredAuth();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;