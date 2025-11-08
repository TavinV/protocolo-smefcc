import React from 'react';
import { FiUsers, FiUserPlus } from 'react-icons/fi';

const UserTabs = ({ activeTab, onTabChange, usersCount, isEditing }) => {
    return (
        <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
                <button
                    onClick={() => onTabChange('list')}
                    className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'list'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <FiUsers className="mr-2 h-5 w-5" />
                    Lista de Usuários
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                        {usersCount}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange('form')}
                    className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'form'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <FiUserPlus className="mr-2 h-5 w-5" />
                    {isEditing ? 'Editar Usuário' : 'Cadastrar Usuário'}
                </button>
            </nav>
        </div>
    );
};

export default UserTabs;