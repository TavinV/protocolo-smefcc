import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import { 
  FiHome, 
  FiUsers, 
  FiPackage, 
  FiTool, 
  FiRepeat, 
  FiRadio,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = ({isMobileOpen, setIsMobileOpen}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { user, logout } = useAuth();
  const handleLogout = () => {
      logout();
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome className="text-xl" /> },
    { path: '/users', label: 'Usuários', icon: <FiUsers className="text-xl" /> },
    { path: '/item-models', label: 'Modelos', icon: <FiPackage className="text-xl" /> },
    { path: '/items', label: 'Itens', icon: <FiTool className="text-xl" /> },
    { path: '/transactions', label: 'Transações', icon: <FiRepeat className="text-xl" /> },
    { path: '/rfid-pendings', label: 'RFIDs Pendentes', icon: <FiRadio className="text-xl" /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
          bg-gray-800 text-white flex-col transition-all duration-300 ease-in-out relative
          ${isMobileOpen 
            ? 'fixed inset-y-0 left-0 z-50 flex w-full sm:hidden' 
            : `sm:flex hidden ${isCollapsed ? 'w-20' : 'w-64'}`
          }
        `}
      >
  
        {/* Logo + Toggle */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center space-x-3">
              <FiShield className="text-xl text-blue-400" />
              <div>
                <h2 className="text-lg font-bold">SAMIF</h2>
                <p className="text-gray-400 text-xs">Controle</p>
              </div>
            </div>
          )}
  
          {(isCollapsed && !isMobileOpen) && (
            <FiShield className="text-xl text-blue-400 mx-auto" />
          )}
  
          {/* Botão toggle desktop */}
          <button
            onClick={toggleSidebar}
            className={`text-gray-300 bg-gray-800 hover:text-white p-1 rounded-lg transition-colors absolute ${
              isCollapsed ? 'right-[-15px]' : 'right-4'
            } sm:block hidden`}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
  
          {/* Botão fechar no mobile */}
          {isMobileOpen && (
            <button
              onClick={closeMobileSidebar}
              className="sm:hidden text-gray-300 bg-gray-800 hover:text-white px-2 py-1 rounded-lg"
            >
              <FiChevronLeft />
            </button>
          )}
        </div>
  
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group
                    ${isActive(item.path)
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                    ${(isCollapsed && !isMobileOpen) ? 'justify-center' : ''}
                  `}
                  title={(isCollapsed && !isMobileOpen) ? item.label : ''}
                >
                  <div
                    className={isActive(item.path)
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-white'
                    }
                  >
                    {item.icon}
                  </div>
  
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
  
        {/* FOOTER */}
        <div className="p-4 border-t border-gray-700 space-y-4">

          {
            isMobileOpen && user && (
              <button
                onClick={handleLogout}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  text-gray-300 hover:bg-red-600 hover:text-white w-full
                  ${(isCollapsed && !isMobileOpen) ? 'justify-center' : ''}
                `}
                title={(isCollapsed && !isMobileOpen) ? 'Sair' : ''}
              >
                <FiLogOut className="text-xl text-gray-400 group-hover:text-white" />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="font-medium text-sm">Sair</span>
                )}
            </button>
            )}
          {/* Botão de Logout */}
          

          {/* Informações do usuário (apenas mobile) */}
          {isMobileOpen && user && (
            <div className="text-center text-gray-300 border-t border-gray-600 pt-4">
              <p className="text-sm font-medium">
                {user?.nome || 'Administrador'}
              </p>
              <p className="text-xs text-gray-400">
                Administrador
              </p>
            </div>
          )}
  
          {/* Versão desktop */}
          <div className={`text-center text-gray-400 text-xs ${(isCollapsed && !isMobileOpen) ? 'px-2' : ''} sm:block hidden`}>
            {(!isCollapsed && !isMobileOpen) && (
              <>
                <a href="https://otaviovinicius-portfolio.vercel.app/" className="font-semibold">
                  Por Otávio Vinícius 👷‍♂️
                </a>
                <p>v1.0.0</p>
              </>
            )}
            {(isCollapsed && !isMobileOpen) && <div>⚡</div>}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;