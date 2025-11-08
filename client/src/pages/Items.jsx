import React, { useState, useEffect } from 'react';
import { FiTool, FiPackage, FiTrash2 } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import useItems from '../hooks/useItems';
import useItemModels from '../hooks/useItemModels';

// Componentes reutilizáveis
import Tabs from '../components/ui/Tabs';
import DeleteConfirmModal from '../components/users/DeleteConfirmModal';
import ItemForm from '../components/items/ItemForm';
import DataTable from '../components/ui/DataTable';

const Items = () => {
    const {
        items,
        loading,
        error,
        createItem,
        deleteItem,
        clearError
    } = useItems();

    const { itemModels } = useItemModels();

    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        modelo: '',
        identificacao: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const filteredItems = items.filter(item =>
        item.modelo?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.identificacao && item.identificacao.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.modelo.trim()) newErrors.modelo = 'Selecione um modelo';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const itemData = {
                modelo: formData.modelo.trim()
            };

            if (formData.identificacao.trim()) {
                itemData.identificacao = formData.identificacao.trim();
            }

            await createItem(itemData);
            toast.success('Item cadastrado com sucesso!');
            resetForm();
            setActiveTab('list');
        } catch (err) {
            // Erro tratado pelo hook
        }
    };

    const resetForm = () => {
        setFormData({ modelo: '', identificacao: '' });
        setSelectedItem(null);
        setErrors({});
    };

    const handleDelete = (item) => {
        setSelectedItem(item);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;

        try {
            await deleteItem(selectedItem._id);
            toast.success('Item excluído com sucesso!');
            setShowDeleteConfirm(false);
            setSelectedItem(null);
        } catch (err) {
            // Erro tratado pelo hook
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'list') resetForm();
    };

    const statusClasses = {
        "em uso": "bg-amber-200 text-amber-800",
        "disponível": "bg-green-100 text-green-800"
    }

    // Colunas da tabela para itens
    const itemColumns = [
        {
            key: 'modelo',
            header: 'Item',
            render: (item) => (
                <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                        <FiTool className="text-white text-lg" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {item.modelo?.nome || 'Modelo não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                            ID: {item._id?.substring(0, 8)}...
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'identificacao',
            header: 'Identificação',
            render: (item) => (
                <div className="text-sm text-gray-900">
                    {item.codigoInterno || (
                        <span className="text-gray-400 italic">Sem identificação</span>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (
                <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + statusClasses[item.status]}>
                    {item.status === "em uso" ? "Emprestado" : "Disponível"}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiTool className="mr-3 text-blue-500" />
                        Itens Físicos
                    </h1>
                    <p className="text-gray-600">
                        Gerencie os itens físicos individuais do sistema
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
                <Tabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    tabs={[
                        {
                            id: 'list',
                            label: 'Lista de Itens',
                            icon: FiTool,
                            count: items.length
                        },
                        {
                            id: 'form',
                            label: 'Cadastrar Item',
                            icon: FiTool
                        }
                    ]}
                />

                <div className="p-6">
                    {activeTab === 'list' ? (
                        <DataTable
                            data={filteredItems}
                            loading={loading}
                            columns={itemColumns}
                            emptyIcon={FiTool}
                            emptyTitle="Nenhum item encontrado"
                            emptyDescription="Comece cadastrando o primeiro item físico"
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder="Pesquisar por modelo ou identificação..."
                            onEdit={null}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <ItemForm
                            formData={formData}
                            errors={errors}
                            itemModels={itemModels}
                            loading={loading}
                            onSubmit={handleSubmit}
                            onCancel={() => handleTabChange('list')}
                            onInputChange={handleInputChange}
                        />
                    )}
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                selectedUser={selectedItem}
                title="Excluir Item"
                message={`Tem certeza que deseja excluir este item físico?`}
            />

            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
};

export default Items;