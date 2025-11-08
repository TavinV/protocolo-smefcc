import React from 'react';
import { FiUser, FiEdit2, FiTrash2, FiRadio, FiCopy } from 'react-icons/fi';
import { BiUnlink } from "react-icons/bi";

const UserTable = ({ users, onEdit, onDelete, onShowRfidModal, onUnlinkRfid }) => {
    const handleCopyRfid = async (rfid) => {
        try {
            await navigator.clipboard.writeText(rfid);
        } catch (err) {
            console.error('Erro ao copiar RFID:', err);
        }
    };

    return (
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
                                    {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {user.rfid ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <FiRadio className="mr-1 h-3 w-3" />
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
                                    {user.rfid ? (
                                        <button
                                            onClick={() => onUnlinkRfid(user)}
                                            className="text-orange-600 hover:text-orange-900 transition-colors"
                                            title="Desvincular RFID"
                                        >
                                            <BiUnlink className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onShowRfidModal(user)}  // ✅ passa o usuário certo
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                            title="Vincular RFID"
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
    );
};

export default UserTable;