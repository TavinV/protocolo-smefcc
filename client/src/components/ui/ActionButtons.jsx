import React from 'react';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';

const ActionButtons = ({
    onAdd,
    onEdit,
    onDelete,
    showAdd = true,
    showEdit = true,
    showDelete = true,
    addLabel = "Adicionar",
    editLabel = "Editar",
    deleteLabel = "Excluir",
    disabled = false
}) => {
    return (
        <div className="flex space-x-2">
            {showAdd && (
                <button
                    onClick={onAdd}
                    disabled={disabled}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiUserPlus className="mr-2 h-4 w-4" />
                    {addLabel}
                </button>
            )}

            {showEdit && (
                <button
                    onClick={onEdit}
                    disabled={disabled}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiEdit2 className="mr-2 h-4 w-4" />
                    {editLabel}
                </button>
            )}

            {showDelete && (
                <button
                    onClick={onDelete}
                    disabled={disabled}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    {deleteLabel}
                </button>
            )}
        </div>
    );
};

export default ActionButtons;
