import React from 'react';
import { FiSearch, FiUsers } from 'react-icons/fi';
import UserTable from './UserTable';

const UserList = ({
    searchTerm,
    onSearchChange,
    users,
    filteredUsers,
    loading,
    onEdit,
    onDelete,
    onShowRfidModal,
    onUnlinkRfid
}) => {
    return (
        <div className="space-y-6">
            {/* Barra de Pesquisa */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Pesquisar por nome ou CPF..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="text-sm text-gray-500">
                    {filteredUsers.length} de {users.length} usuários
                </div>
            </div>

            {/* Tabela de Usuários */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Carregando usuários...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                    <FiUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhum usuário encontrado</h3>
                    <p className="text-gray-400">Comece cadastrando o primeiro usuário do sistema</p>
                </div>
            ) : (
                <UserTable
                    users={filteredUsers}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onShowRfidModal={onShowRfidModal}
                    onUnlinkRfid={onUnlinkRfid}
                />
            )}
        </div>
    );
};

export default UserList;