import React, { useState, useEffect } from 'react';
import { FiPackage, FiEdit2, FiTrash2, FiTag, FiTruck, FiBox } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import useItemModels from '../hooks/useItemModels';

// Componentes reutilizáveis
import Tabs from '../components/ui/Tabs';
import DeleteConfirmModal from '../components/users/DeleteConfirmModal';
import ItemModelForm from '../components/item-models/ItemModelForm';
import DataTable from '../components/ui/DataTable';

const ItemModels = () => {
    const {
        itemModels,
        loading,
        error,
        createModel,
        updateModel,
        deleteModel,
        clearError
    } = useItemModels();

    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModel, setSelectedModel] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        categoria: '',
        fabricante: '',
        quantidadeTotal: 0,
        quantidadeDisponivel: 0
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const filteredModels = itemModels.filter(model =>
        model.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (model.descricao && model.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (model.fabricante && model.fabricante.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleInputChange = (field, value) => {
        // Para campos numéricos, converter para número
        if (field === 'quantidadeTotal' || field === 'quantidadeDisponivel') {
            value = parseInt(value) || 0;
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nome.trim()) newErrors.nome = 'Nome do modelo é obrigatório';
        if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
        if (!formData.categoria.trim()) newErrors.categoria = 'Categoria é obrigatória';
        if (!formData.fabricante.trim()) newErrors.fabricante = 'Fabricante é obrigatório';
        if (formData.quantidadeTotal < 1) newErrors.quantidadeTotal = 'Quantidade total deve ser maior que 0';
        if (formData.quantidadeDisponivel < 0) newErrors.quantidadeDisponivel = 'Quantidade disponível não pode ser negativa';
        if (formData.quantidadeDisponivel > formData.quantidadeTotal) {
            newErrors.quantidadeDisponivel = 'Quantidade disponível não pode ser maior que a total';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const modelData = {
                nome: formData.nome.trim(),
                descricao: formData.descricao.trim(),
                categoria: formData.categoria.trim(),
                fabricante: formData.fabricante.trim(),
                quantidadeTotal: formData.quantidadeTotal,
                quantidadeDisponivel: formData.quantidadeDisponivel
            };

            if (selectedModel) {
                await updateModel(selectedModel._id, modelData);
                toast.success('Modelo atualizado com sucesso!');
            } else {
                await createModel(modelData);
                toast.success('Modelo cadastrado com sucesso!');
            }

            resetForm();
            setActiveTab('list');
        } catch (err) {
            // Erro tratado pelo hook
        }
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            descricao: '',
            categoria: '',
            fabricante: '',
            quantidadeTotal: 0,
            quantidadeDisponivel: 0
        });
        setSelectedModel(null);
        setErrors({});
    };

    const handleEdit = (model) => {
        setFormData({
            nome: model.nome,
            descricao: model.descricao || '',
            categoria: model.categoria || '',
            fabricante: model.fabricante || '',
            quantidadeTotal: model.quantidadeTotal || 0,
            quantidadeDisponivel: model.quantidadeDisponivel || 0
        });
        setSelectedModel(model);
        setActiveTab('form');
    };

    const handleDelete = (model) => {
        setSelectedModel(model);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!selectedModel) return;

        try {
            await deleteModel(selectedModel._id);
            toast.success('Modelo excluído com sucesso!');
            setShowDeleteConfirm(false);
            setSelectedModel(null);
        } catch (err) {
            // Erro tratado pelo hook
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'list') resetForm();
    };

    // Colunas da tabela para modelos
    const modelColumns = [
        {
            key: 'nome',
            header: 'Modelo',
            render: (item) => (
                <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <FiPackage className="text-white text-lg" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {item.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                            {item.fabricante}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'categoria',
            header: 'Categoria',
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <FiTag className="text-gray-400 h-4 w-4" />
                    <span className="text-sm text-gray-900 capitalize">{item.categoria}</span>
                </div>
            )
        },
        {
            key: 'estoque',
            header: 'Estoque',
            render: (item) => (
                <div className="text-sm">
                    <div className="flex items-center space-x-2">
                        <FiBox className="text-gray-400 h-4 w-4" />
                        <span className="font-medium text-gray-900">{item.quantidadeDisponivel}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-600">{item.quantidadeTotal}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {item.quantidadeTotal - item.quantidadeDisponivel} em uso
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiPackage className="mr-3 text-blue-500" />
                        Modelos de Itens
                    </h1>
                    <p className="text-gray-600">
                        Gerencie os modelos e tipos de itens do sistema
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
                            label: 'Lista de Modelos',
                            icon: FiPackage,
                            count: itemModels.length
                        },
                        {
                            id: 'form',
                            label: selectedModel ? 'Editar Modelo' : 'Cadastrar Modelo',
                            icon: FiPackage
                        }
                    ]}
                />

                <div className="p-6">
                    {activeTab === 'list' ? (
                        <DataTable
                            data={filteredModels}
                            loading={loading}
                            columns={modelColumns}
                            emptyIcon={FiPackage}
                            emptyTitle="Nenhum modelo encontrado"
                            emptyDescription="Comece cadastrando o primeiro modelo de item"
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder="Pesquisar por nome, fabricante ou descrição..."
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <ItemModelForm
                            formData={formData}
                            errors={errors}
                            isEditing={!!selectedModel}
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
                selectedUser={selectedModel}
                title="Excluir Modelo"
                message={`Tem certeza que deseja excluir o modelo "${selectedModel?.nome}"?`}
            />

            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
};

export default ItemModels;