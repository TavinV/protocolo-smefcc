import React from 'react';
import { FiRadio, FiTrash2, FiClock } from 'react-icons/fi';
import { FaRegCopy } from "react-icons/fa";
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

const RfidPendingList = ({ rfidPendings, loading, onDelete, onViewAll }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          RFIDs Pendentes
        </h3>
        <LoadingSpinner text="Carregando RFIDs..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          RFIDs Pendentes
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver todos
          </button>
        )}
      </div>

      {rfidPendings.length === 0 ? (
        <EmptyState
          icon={<FiRadio />}
          title="Nenhum RFID pendente"
          description="RFIDs dos leitores aparecerão aqui automaticamente"
        />
      ) : (
        <div className="space-y-3">
          {rfidPendings.slice(0, 5).map((rfid) => (
            <div
              key={rfid._id}
              className="flex items-center justify-between p-3 border border-yellow-100 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                  <FiRadio className="text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {rfid.rfid.substring(0, 30)}...
                  </p>
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <FiClock className="inline" />
                    <span>{formatDate(rfid.createdAt)}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 px-2 py-1">
                  <button className='text-gray-500 hover:text-gray-700 border-0 p-0 m-0' title="Copiar RFID">
                    <FaRegCopy
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        navigator.clipboard.writeText(rfid.rfid);
                      }}
                    />
                  </button>
                </span>
                {onDelete && (
                  <button
                    onClick={() => onDelete(rfid._id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Remover RFID"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RfidPendingList;
