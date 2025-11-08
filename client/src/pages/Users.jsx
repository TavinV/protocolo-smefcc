import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiUsers } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';

// Hooks
import useUsers from '../hooks/useUsers';
import useRfidPending from '../hooks/useRfidPending';

// Componentes
import UserTable from '../components/users/UserTable';
import UserForm from '../components/users/UserForm';
import RfidSelector from '../components/users/RfidSelector';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import SearchBar from '../components/ui/SearchBar';
import ActionButtons from '../components/ui/ActionButtons';

const Users = () => {
    // Hooks
    const {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        linkRfid,
        unlinkRfid,
        clearError
    } = useUsers();

    const {
        rfidPendings,
        fetchRfidPendings
    } = useRfidPending();

    // Estados
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserForm, setShowUserForm] = useState(false);
    const [showRfidSelector, setShowRfidSelector] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(''); // 'create', 'edit', 'delete', 'linkRfid', 'unlinkRfid'

    // Filtrar usuários baseado na pesquisa
    const filteredUsers = users.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf.includes(searchTerm.replace(/\D/g, ''))
    );

    // Limpar erros quando fechar modais
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // Handlers
    const handleCreateUser = () => {
        setSelectedUser(null);
        setActionType('create');
        setShowUserForm(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setActionType('edit');
        setShowUserForm(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setActionType('delete');
        setShowConfirmDialog(true);
    };

    const handleLinkRfid = (user) => {
        setSelectedUser(user);
        setActionType('linkRfid');
        setShowRfidSelector(true);
    };

    const handleUnlinkRfid = (user) => {
        setSelectedUser(user);
        setActionType('unlinkRfid');
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = async () => {
        try {
            switch (actionType) {
                case 'delete':
                    await deleteUser(selectedUser._id);
                    toast.success('Usuário excluído com sucesso!');
                    break;

                case 'unlinkRfid':
                    await unlinkRfid(selectedUser._id);
                    toast.success('RFID desvinculado com sucesso!');
                    break;

                default:
                    break;
            }
        } catch (err) {
            toast.error('Erro ao executar ação');
        } finally {
            setShowConfirmDialog(false);
            setSelectedUser(null);
            setActionType('');
        }
    };

    const handleUserSubmit = async (userData) => {
        try {
            if (actionType === 'create') {
                await createUser(userData);
                toast.success('Usuário cadastrado com sucesso!');
            } else if (actionType === 'edit') {
                await updateUser(selectedUser._id, userData);
                toast.success('Usuário atualizado com sucesso!');
            }
            setShowUserForm(false);
            setSelectedUser(null);
            setActionType('');
        } catch (err) {
            // Erro é tratado pelo hook e exibido no useEffect
        }
    };

    const handleRfidSelect = async (rfid) => {
        if (actionType === 'linkRfid' && selectedUser) {
            try {
                await linkRfid(selectedUser._id, { rfid });
                toast.success('RFID vinculado com sucesso!');
                setShowRfidSelector(false);
                setSelectedUser(null);
                setActionType('');
            } catch (err) {
                // Erro é tratado pelo hook
            }
        }
    };

    const getConfirmDialogConfig = () => {
        switch (actionType) {
            case 'delete':
                return {
                    title: 'Excluir Usuário',
                    message: `Tem certeza que deseja excluir o usuário "${selectedUser?.nome}"? Esta ação não pode ser desfeita.`,
                    confirmText: 'Excluir',
                    type: 'danger'
                };

            case 'unlinkRfid':
                return {
                    title: 'Desvincular RFID',
                    message: `Tem certeza que deseja desvincular o RFID do usuário "${selectedUser?.nome}"?`,
                    confirmText: 'Desvincular',
                    type: 'warning'
                };

            default:
                return {
                    title: 'Confirmar Ação',
                    message: 'Tem certeza que deseja executar esta ação?',
                    confirmText: 'Confirmar',
                    type: 'warning'
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
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

                <ActionButtons
                    onAdd={handleCreateUser}
                    addLabel="Novo Usuário"
                    showEdit={false}
                    showDelete={false}
                />
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onClear={() => setSearchTerm('')}
                            placeholder="Pesquisar por nome ou CPF..."
                        />
                    </div>

                    <div className="text-sm text-gray-500">
                        {filteredUsers.length} de {users.length} usuários
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <UserTable
                users={filteredUsers}
                loading={loading}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onLinkRfid={handleLinkRfid}
                onUnlinkRfid={handleUnlinkRfid}
            />

            {/* User Form Modal */}
            <Modal
                isOpen={showUserForm}
                onClose={() => {
                    setShowUserForm(false);
                    setSelectedUser(null);
                    setActionType('');
                }}
                title={actionType === 'edit' ? 'Editar Usuário' : 'Cadastrar Usuário'}
                size="large"
            >
                <UserForm
                    user={selectedUser}
                    onSubmit={handleUserSubmit}
                    onCancel={() => {
                        setShowUserForm(false);
                        setSelectedUser(null);
                        setActionType('');
                    }}
                    loading={loading}
                    onOpenRfidSelector={() => setShowRfidSelector(true)}
                />
            </Modal>

            {/* RFID Selector Modal */}
            <RfidSelector
                isOpen={showRfidSelector}
                onClose={() => {
                    setShowRfidSelector(false);
                    setSelectedUser(null);
                    setActionType('');
                }}
                rfidPendings={rfidPendings}
                onSelectRfid={handleRfidSelect}
                loading={false}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => {
                    setShowConfirmDialog(false);
                    setSelectedUser(null);
                    setActionType('');
                }}
                onConfirm={handleConfirmAction}
                {...getConfirmDialogConfig()}
            />

            {/* Toast Notifications */}
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
    );
};

export default Users;