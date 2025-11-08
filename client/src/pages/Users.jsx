import React, { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import useUsers from '../hooks/useUsers';
import useRfidPending from '../hooks/useRfidPending';

// Componentes
import UserTabs from '../components/users/UserTabs';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import RfidModal from '../components/users/RfidModal';
import DeleteConfirmModal from '../components/users/DeleteConfirmModal';

const Users = () => {
    const {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        unlinkRfid,
        linkRfid,
        clearError
    } = useUsers();

    const { rfidPendings, fetchRfidPendings, deleteRfidPending } = useRfidPending();

    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRfidModal, setShowRfidModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [adminKey, setAdminKey] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        role: 'funcionario',
        rfid: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // 🔎 Filtragem de usuários
    const filteredUsers = users.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf.includes(searchTerm.replace(/\D/g, ''))
    );

    const formatCPF = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    // 📋 Formulário
    const handleInputChange = (field, value) => {
        if (field === 'cpf') value = formatCPF(value);
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
        else if (formData.cpf.replace(/\D/g, '').length !== 11)
            newErrors.cpf = 'CPF deve ter 11 dígitos';
        if (!formData.rfid.trim()) newErrors.rfid = 'RFID é obrigatório';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const userData = {
                nome: formData.nome.trim(),
                cpf: formData.cpf.replace(/\D/g, ''),
                role: formData.role,
                rfid: formData.rfid.trim()
            };

            if (selectedUser) {
                await updateUser(selectedUser._id, userData);
                toast.success('Usuário atualizado com sucesso!');
            } else {
                await createUser(userData);
                toast.success('Usuário cadastrado com sucesso!');
            }

            resetForm();
            setActiveTab('list');
        } catch { }
    };

    const resetForm = () => {
        setFormData({ nome: '', cpf: '', role: 'funcionario', rfid: '' });
        setSelectedUser(null);
        setErrors({});
    };

    // ⚙️ Ações
    const handleEdit = (user) => {
        setFormData({
            nome: user.nome,
            cpf: user.cpf,
            role: user.role,
            rfid: user.rfid || ''
        });
        setSelectedUser(user);
        setActiveTab('form');
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteConfirm(true);
    };

    const handleUnlinkRfid = async (user) => {
        try {
            await unlinkRfid(user._id);
            toast.success('RFID desvinculado com sucesso!');
        } catch { }
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        if (selectedUser.role === 'admin') {
            toast.error('Chave administrativa incorreta!');
            return;
        }

        try {
            await deleteUser(selectedUser._id);
            toast.success('Usuário excluído com sucesso!');
            setShowDeleteConfirm(false);
            setSelectedUser(null);
            setAdminKey('');
        } catch { }
    };

    // 🔗 Lógica corrigida de vincular RFID
    const handleRfidSelect = async (rfidValue) => {
        if (!selectedUser) {
            formData.rfid = rfidValue;
            setShowRfidModal(false)
            return;
        }

        try {
            await linkRfid(selectedUser._id, { rfid: rfidValue });
            await deleteRfidPendingByValue(rfidValue);
            toast.success('RFID vinculado com sucesso!');
            await fetchRfidPendings(); // atualiza a lista
        } catch (err) {
            toast.error('Erro ao vincular RFID.');
        } finally {
            setShowRfidModal(false);
        }
    };

    // 🧹 Remover RFID pendente pelo valor
    const deleteRfidPendingByValue = async (rfidValue) => {
        const found = rfidPendings.find(p => p.rfid === rfidValue);
        if (found) {
            await deleteRfidPending(found._id);
        }
    };

    const handleShowRfidModal = (user) => {
        setSelectedUser(user);
        setShowRfidModal(true);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'list') resetForm();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiUsers className="mr-3 text-blue-500" />
                        Gerenciar Usuários
                    </h1>
                    <p className="text-gray-600">
                        Cadastre e gerencie os usuários do sistema
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
                <UserTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    usersCount={users.length}
                    isEditing={!!selectedUser}
                />

                <div className="p-6">
                    {activeTab === 'list' ? (
                        <UserList
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            users={users}
                            filteredUsers={filteredUsers}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onShowRfidModal={handleShowRfidModal}
                            onUnlinkRfid={handleUnlinkRfid}
                        />
                    ) : (
                        <UserForm
                            formData={formData}
                            errors={errors}
                            isEditing={!!selectedUser}
                            loading={loading}
                            onSubmit={handleSubmit}
                            onCancel={() => handleTabChange('list')}
                            onInputChange={handleInputChange}
                            onShowRfidModal={() => handleShowRfidModal(selectedUser)}
                        />
                    )}
                </div>
            </div>

            <RfidModal
                isOpen={showRfidModal}
                onClose={() => setShowRfidModal(false)}
                rfidPendings={rfidPendings}
                onSelectRfid={handleRfidSelect}
            />

            <DeleteConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setAdminKey('');
                }}
                onConfirm={confirmDelete}
                selectedUser={selectedUser}
                adminKey={adminKey}
                onAdminKeyChange={setAdminKey}
            />

            <Toaster position="bottom-right" />
        </div>
    );
};

export default Users;
