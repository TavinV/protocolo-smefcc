import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiRadio, FiCopy } from 'react-icons/fi';
import InputField from '../forms/InputField';
import SelectField from '../forms/SelectField';

const UserForm = ({
    user = null,
    onSubmit,
    onCancel,
    loading = false,
    onOpenRfidSelector
}) => {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        senha: '',
        confirmarSenha: '',
        role: 'funcionario',
        rfid: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Preencher form se estiver editando
    useEffect(() => {
        if (user) {
            setFormData({
                nome: user.nome || '',
                cpf: user.cpf || '',
                senha: '',
                confirmarSenha: '',
                role: user.role || 'funcionario',
                rfid: user.rfid || ''
            });
        }
    }, [user]);

    const formatCPF = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return numbers.substring(0, 14);
    };

    const handleChange = (field, value) => {
        if (field === 'cpf') {
            value = formatCPF(value);
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpar erro do campo quando usuário começar a digitar
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }

        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
            newErrors.cpf = 'CPF deve ter 11 dígitos';
        }

        if (!user && !formData.senha) {
            newErrors.senha = 'Senha é obrigatória';
        } else if (formData.senha && formData.senha.length < 6) {
            newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
        }

        if (formData.senha !== formData.confirmarSenha) {
            newErrors.confirmarSenha = 'As senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Preparar dados para envio
            const submitData = {
                nome: formData.nome.trim(),
                cpf: formData.cpf.replace(/\D/g, ''),
                role: formData.role
            };

            // Incluir senha apenas se for nova ou estiver criando
            if (formData.senha) {
                submitData.senha = formData.senha;
            }

            // Incluir RFID apenas se estiver preenchido
            if (formData.rfid.trim()) {
                submitData.rfid = formData.rfid.trim();
            }

            onSubmit(submitData);
        }
    };

    const handleRfidSelect = (rfid) => {
        setFormData(prev => ({
            ...prev,
            rfid
        }));
    };

    const roleOptions = [
        { value: 'funcionario', label: 'Funcionário' },
        { value: 'admin', label: 'Administrador' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Nome completo"
                    value={formData.nome}
                    onChange={(value) => handleChange('nome', value)}
                    placeholder="Digite o nome completo"
                    error={errors.nome}
                    required
                    icon={FiUser}
                />

                <InputField
                    label="CPF"
                    value={formData.cpf}
                    onChange={(value) => handleChange('cpf', value)}
                    placeholder="000.000.000-00"
                    error={errors.cpf}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label={user ? "Nova senha (opcional)" : "Senha"}
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={(value) => handleChange('senha', value)}
                    placeholder={user ? "Deixe em branco para manter atual" : "Digite a senha"}
                    error={errors.senha}
                    required={!user}
                    icon={FiLock}
                    helperText="Mínimo 6 caracteres"
                />

                <InputField
                    label="Confirmar senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmarSenha}
                    onChange={(value) => handleChange('confirmarSenha', value)}
                    placeholder="Confirme a senha"
                    error={errors.confirmarSenha}
                    required={!user}
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="text-sm text-gray-700">
                    Mostrar senhas
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                    label="Tipo de usuário"
                    value={formData.role}
                    onChange={(value) => handleChange('role', value)}
                    options={roleOptions}
                    required
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        RFID (opcional)
                    </label>
                    <div className="flex space-x-2">
                        <InputField
                            value={formData.rfid}
                            onChange={(value) => handleChange('rfid', value)}
                            placeholder="Código do RFID"
                            showCopyButton={!!formData.rfid}
                            onCopy={async (value) => {
                                try {
                                    await navigator.clipboard.writeText(value);
                                } catch (err) {
                                    console.error('Falha ao copiar RFID:', err);
                                }
                            }}
                            className="flex-1"
                        />

                        <button
                            type="button"
                            onClick={onOpenRfidSelector}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FiRadio className="h-4 w-4 mr-2" />
                            RFIDs
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Vincule um RFID pendente ou cole manualmente o código
                    </p>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {user ? 'Atualizando...' : 'Cadastrando...'}
                        </div>
                    ) : (
                        user ? 'Atualizar Usuário' : 'Cadastrar Usuário'
                    )}
                </button>
            </div>
        </form>
    );
};

export default UserForm;