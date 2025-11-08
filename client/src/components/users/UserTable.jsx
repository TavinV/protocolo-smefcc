import React from 'react';
import { FiUser, FiEdit2, FiTrash2, FiRadio, FiCopy } from 'react-icons/fi';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

const UserTable = ({
    users,
    loading,
    onEdit,
    onDelete,
    onLinkRfid,
    onUnlinkRfid
}) => {
    const formatCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handleCopyRfid = async (rfid) => {
        try {
            await navigator.clipboard.writeText(rfid);
            // Poderia adicionar um toast aqui
        } catch (err) {
            console.error('Falha ao copiar RFID:', err);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                <LoadingSpinner text="Carregando usuários..." />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            {users.length === 0 ? (
                <EmptyState
                    icon={<FiUser className="text-4xl text-gray-300 mx-auto mb-3" />}
                    title="Nenhum usuário encontrado"
                    description="Comece cadastrando o primeiro usuário do sistema"
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CPF
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    RFID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <FiUser className="text-white text-lg" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.nome}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-mono">
                                            {formatCPF(user.cpf)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.rfid ? (
                                            <div className="flex items-center space-x-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FiRadio className="mr-1" />
                                                    Vinculado
                                                </span>
                                                <button
                                                    onClick={() => handleCopyRfid(user.rfid)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="Copiar RFID"
                                                >
                                                    <FiCopy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Sem RFID
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.role === 'admin' ? 'Administrador' : 'Funcionário'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {!user.rfid ? (
                                                <button
                                                    onClick={() => onLinkRfid(user)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Vincular RFID"
                                                >
                                                    <FiRadio className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onUnlinkRfid(user)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    title="Remover RFID"
                                                >
                                                    <FiRadio className="h-4 w-4" />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => onEdit(user)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                title="Editar usuário"
                                            >
                                                <FiEdit2 className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => onDelete(user)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                title="Excluir usuário"
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserTable;