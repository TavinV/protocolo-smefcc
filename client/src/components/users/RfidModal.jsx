import React, { useState } from 'react';
import { FiCopy, FiRadio, FiX, FiAlertTriangle } from 'react-icons/fi';

const RfidModal = ({
    isOpen,
    onClose,
    rfidPendings,
    onSelectRfid
}) => {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = async (rfid) => {
        try {
            await navigator.clipboard.writeText(rfid);
            setCopiedId(rfid);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Erro ao copiar RFID:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                <div className="relative inline-block w-full max-w-2xl p-6 px-4 pt-5 pb-4 text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            <FiRadio className="inline mr-2 text-blue-500" />
                            Selecionar RFID Pendente
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <FiAlertTriangle className="text-blue-500 text-lg mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-blue-800 text-sm font-medium">
                                        RFIDs Pendentes de Vinculação
                                    </p>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Selecione um RFID para vincular automaticamente ao usuário ou copie o valor.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {rfidPendings.length === 0 ? (
                            <div className="text-center py-8">
                                <FiRadio className="text-4xl text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-500">Nenhum RFID pendente</h3>
                                <p className="text-gray-400">Todos os RFIDs já foram vinculados</p>
                            </div>
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
                                                onClick={() => onSelectRfid(rfid.rfid)}
                                                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Selecionar
                                            </button>

                                            <button
                                                onClick={() => handleCopy(rfid.rfid)}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                title="Copiar RFID"
                                            >
                                                {copiedId === rfid.rfid ? (
                                                    <FiCopy className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <FiCopy className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RfidModal;