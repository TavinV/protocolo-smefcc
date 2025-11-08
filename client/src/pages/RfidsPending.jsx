import React, { useState, useEffect } from 'react';
import {
    FiRadio,
    FiTrash2,
    FiCopy,
    FiSearch,
    FiClock,
    FiAlertTriangle,
    FiRefreshCw
} from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import useRfidPending from '../hooks/useRfidPending';

const RfidPendings = () => {
    const {
        rfidPendings,
        loading,
        error,
        deleteRfidPending,
        fetchRfidPendings,
        clearError
    } = useRfidPending();

    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [selectedRfid, setSelectedRfid] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Limpar erros
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // Filtrar RFIDs
    const filteredRfids = rfidPendings.filter(rfid =>
        rfid.rfid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchRfidPendings();
            toast.success('RFIDs atualizados!');
        } catch (err) {
            // Erro já é tratado pelo hook
        } finally {
            setRefreshing(false);
        }
    };

    const handleDelete = (rfid) => {
        setSelectedRfid(rfid);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!selectedRfid) return;

        try {
            await deleteRfidPending(selectedRfid._id);
            toast.success('RFID removido com sucesso!');
            setShowDeleteConfirm(false);
            setSelectedRfid(null);
        } catch (err) {
            // Erro já é tratado pelo hook
        }
    };

    const handleCopyRfid = async (rfid) => {
        try {
            await navigator.clipboard.writeText(rfid);
            toast.success('RFID copiado!');
        } catch (err) {
            toast.error('Erro ao copiar RFID');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Modal de Confirmação
    const DeleteConfirmModal = () => {
        if (!showDeleteConfirm) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                        onClick={() => setShowDeleteConfirm(false)}
                    ></div>

                    <div className="relative inline-block w-full max-w-md p-6 px-4 pt-5 pb-4 text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                        <div className="flex items-start space-x-3">
                            <div className="shrink-0 p-2 rounded-full bg-red-100 text-red-600">
                                <FiAlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Remover RFID Pendente
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Tem certeza que deseja remover o RFID
                                    <strong> "{selectedRfid?.rfid}"</strong>? Esta ação não pode ser desfeita.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiRadio className="mr-3 text-blue-500" />
                        RFIDs Pendentes
                    </h1>
                    <p className="text-gray-600">
                        Gerencie os RFIDs aguardando vinculação com usuários
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={refreshing || loading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    <FiRefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Atualizando...' : 'Atualizar'}
                </button>
            </div>

            {/* Alertas */}
            {rfidPendings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <FiAlertTriangle className="text-yellow-500 text-lg mt-0.5 shrink-0" />
                        <div>
                            <p className="text-yellow-800 font-medium">
                                {rfidPendings.length} RFID(s) pendente(s) de vinculação
                            </p>
                            <p className="text-yellow-700 text-sm mt-1">
                                Estes RFIDs foram lidos pelos sensores e aguardam ser vinculados a usuários.
                                Você pode removê-los ou vinculá-los através da página de usuários.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-300 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiRadio className="text-lg" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total de RFIDs</p>
                            <p className="text-2xl font-bold text-gray-800">{rfidPendings.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-300 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <FiClock className="text-lg" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Mais Antigo</p>
                            <p className="text-sm font-bold text-gray-800">
                                {rfidPendings.length > 0
                                    ? formatDate(rfidPendings[rfidPendings.length - 1].createdAt).split(' ')[0]
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de Pesquisa */}
            <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Pesquisar por RFID..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de RFIDs */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Carregando RFIDs...</p>
                    </div>
                ) : filteredRfids.length === 0 ? (
                    <div className="text-center py-8">
                        <FiRadio className="text-4xl text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-500">
                            {searchTerm ? 'Nenhum RFID encontrado' : 'Nenhum RFID pendente'}
                        </h3>
                        <p className="text-gray-400">
                            {searchTerm
                                ? 'Tente alterar os termos da pesquisa'
                                : 'Todos os RFIDs foram vinculados ou não há leituras recentes'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        RFID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data/Hora
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRfids.map((rfid) => (
                                    <tr key={rfid._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <FiRadio className="text-lg" />
                                                </div>
                                                <div>
                                                    <p className="font-mono font-medium text-gray-800 text-sm">
                                                        {rfid.rfid.length > 20 ? `${rfid.rfid.substring(0, 20)}...` : rfid.rfid}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <FiClock className="h-4 w-4" />
                                                <span>{formatDate(rfid.createdAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleCopyRfid(rfid.rfid)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Copiar RFID"
                                                >
                                                    <FiCopy className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(rfid)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    title="Remover RFID"
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

            {/* Modal de Confirmação */}
            <DeleteConfirmModal />

            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
};

export default RfidPendings;