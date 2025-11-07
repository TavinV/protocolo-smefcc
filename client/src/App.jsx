import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rota pública - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout>
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h1 className="text-2xl font-bold text-gray-800 mb-4">👥 Gerenciar Usuários</h1>
                      <p className="text-gray-600">Página em desenvolvimento - Em breve</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/items" element={
              <ProtectedRoute>
                <Layout>
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h1 className="text-2xl font-bold text-gray-800 mb-4">🔩 Gerenciar Itens</h1>
                      <p className="text-gray-600">Página em desenvolvimento - Em breve</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Fallback - Redirecionar para dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;