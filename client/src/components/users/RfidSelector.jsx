import React, { useState } from 'react';
import { FiCopy, FiRadio, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Modal from '../ui/Modal';
import EmptyState from '../ui/EmptyState';

const RfidSelector = ({
    isOpen,
    onClose,
    rfidPendings,
    onSelectRfid,
    loading = false
}) => {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopyRfid = async (rfid) => {
        try {
            await navigator.clipboard.writeText(rfid);
            setCopiedId(rfid);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Falha ao copiar RFID:', err);
        }
    };

    const handleSelectRfid = (rfid) => {
        onSelectRfid(rfid);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Selecionar RFID Pendente"
            size="medium"
        >
            <div className="space-y-4">
                {/* Informação */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <FiAlertCircle className="text-blue-500 text-lg mt-0.5 shrink-0" />
                        <div>
                            <p className="text-blue-800 text-sm font-medium">
                                RFIDs Pendentes de Vinculação
                            </p>
                            <p className="text-blue-700 text-sm mt-1">
                                Selecione um RFID para vincular automaticamente ao usuário ou copie o valor para usar manualmente.
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Carregando RFIDs...</p>
                    </div>
                ) : rfidPendings.length === 0 ? (
                    <EmptyState
                        icon={<FiRadio className="text-4xl text-gray-300 mx-auto mb-3" />}
                        title="Nenhum RFID pendente"
                        description="Todos os RFIDs já foram vinculados ou não há leituras recentes"
                    />
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {rfidPendings.map((rfid) => (
                            <div
                                key={rfid._id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <FiRadio className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-mono font-medium text-gray-800 text-sm">
                                            {rfid.rfid.length > 20 ? `${rfid.rfid.substring(0, 20)}...` : rfid.rfid}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Sensor: {rfid.sensorId} • {new Date(rfid.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleSelectRfid(rfid.rfid)}
                                        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Selecionar
                                    </button>

                                    <button
                                        onClick={() => handleCopyRfid(rfid.rfid)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                        title="Copiar RFID"
                                    >
                                        {copiedId === rfid.rfid ? (
                                            <FiCheck className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <FiCopy className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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

export default RfidSelector;