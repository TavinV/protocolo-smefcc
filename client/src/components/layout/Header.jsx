import React from 'react';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const Header = ({onMobileMenuClick}) => {
    
  const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
    };

    return (
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex justify-center sm:justify-between items-center px-10 md:px-6 py-4">
        <div className='absolute left-5 p-0 sm:hidden flex items-center'>
            <button className='sm:hidden flex' onClick={()=>{
                onMobileMenuClick()
            }}>
                <FiMenu className='text-2xl'/>
            </button>
        </div>
        {/* Left Side - Page Title */}
        <div className="flex items-center space-x-3s">
            <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                Sistema de Empréstimo
            </h1>
            <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                Protocolo SMEFCC
            </p>
            </div>
        </div>

        {/* Right Side - User Info and Logout */}
        <div className="flex items-center space-x-3 md:space-x-4">
            <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-700">
                {user?.nome || 'Administrador'}
            </p>
            <p className="text-xs text-gray-500">
                Administrador
            </p>
            </div>
            
            <button
            onClick={handleLogout}
            className="sm:flex hidden items-center space-x-2 bg-red-500 hover:bg-red-600 text-white md:px-3 md:py-2 p-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
            <FiLogOut className="text-sm md:text-lg" />
            <span className="">Sair</span>
            </button>
        </div>
        </div>
    </header>
    );
};

export default Header;