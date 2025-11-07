// Utilitários para autenticação
export const storageKeys = {
    TOKEN: 'auth_token',
    USER: 'auth_user',
  };
  
  export const getStoredToken = () => {
    return localStorage.getItem(storageKeys.TOKEN);
  };
  
  export const getStoredUser = () => {
    const userStr = localStorage.getItem(storageKeys.USER);
    return userStr ? JSON.parse(userStr) : null;
  };
  
  export const setStoredAuth = (token, user) => {
    localStorage.setItem(storageKeys.TOKEN, token);
    localStorage.setItem(storageKeys.USER, JSON.stringify(user));
  };
  
  export const clearStoredAuth = () => {
    localStorage.removeItem(storageKeys.TOKEN);
    localStorage.removeItem(storageKeys.USER);
  };
  
  export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };
