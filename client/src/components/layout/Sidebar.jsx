import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <aside className={`
      bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out relative
      ${isCollapsed ? 'w-20' : 'sm:w-64 w-full'}
    `}>
      {/* Logo e Botão de Toggle */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className={"flex items-center space-x-3 "}>
            <FiShield className="text-xl text-blue-400" />
            <div>
              <h2 className="text-lg font-bold">SMEFCC</h2>
              <p className="text-gray-400 text-xs">Controle</p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <FiShield className={"text-xl text-blue-400 mx-auto"} />
        )}

        <button
          onClick={toggleSidebar}
          className={"text-gray-300 bg-gray-800 hover:text-white p-1 rounded-lg  transition-colors absolute sm:right-[-15px] " + (isCollapsed ? 'right-[-15px]' : 'right-4')}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  ${isActive(item.path)
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`
                  ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                `}>
                  {item.icon}
                </div>
                
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer do Sidebar */}
      <div className="p-4 border-t border-gray-700">
        <div className={`text-center text-gray-400 text-xs ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <>
              <a href='https://otaviovinicius-portfolio.vercel.app/' className='font-semibold'>Por Otávio Vinícius 👷‍♂️</a>
              <p>v1.0.0</p>
            </>
          )}
          {isCollapsed && (
            <div>⚡</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;