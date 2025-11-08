import React from 'react';
import { FiX, FiUser, FiPackage, FiCalendar, FiRepeat, FiInfo } from 'react-icons/fi';
import Modal from '../ui/Modal';

const TransactionDetails = ({
    transaction,
    isOpen,
    onClose
}) => {
    if (!transaction) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (tipo) => {
        return tipo === 'retirada'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-green-100 text-green-800';
    };

    const getStatusText = (tipo) => {
        return tipo === 'retirada' ? 'Retirada' : 'Devolução';
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalhes da Transação"
            size="medium"
        >
            <div className="space-y-6">
                {/* Status da Transação */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getStatusColor(transaction.tipo)}`}>
                                <FiRepeat className="text-lg" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {getStatusText(transaction.tipo)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ID: {transaction._id}
                                </p>
                            </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.tipo)}`}>
                            {getStatusText(transaction.tipo)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações do Usuário */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                            <FiUser className="mr-2 text-blue-500" />
                            Informações do Usuário
                        </h4>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-gray-500">Nome</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {transaction.usuario?.nome || 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">CPF</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {transaction.usuario?.cpf ?
                                        transaction.usuario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') :
                                        'Não informado'
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">RFID</p>
                                <p className="text-sm font-mono text-gray-900">
                                    {transaction.usuario?.rfid || 'Não vinculado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informações do Item */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                            <FiPackage className="mr-2 text-green-500" />
                            Informações do Item
                        </h4>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-gray-500">Item</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {transaction.item?.codigoInterno || 'Não informado'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='bg-gray-300 text-gray-300' />
                {/* Informações da Transação */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                        <FiInfo className="mr-2 text-purple-500" />
                        Informações da Transação
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <FiCalendar className="text-gray-400 h-5 w-5" />
                            <div>
                                <p className="text-xs text-gray-500">Data e Hora</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formatDate(transaction.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FiRepeat className="text-gray-400 h-5 w-5" />
                            <div>
                                <p className="text-xs text-gray-500">Tipo</p>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                    {transaction.tipo}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TransactionDetails;