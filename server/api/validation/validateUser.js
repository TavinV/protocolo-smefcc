import Joi from "joi";
import validateCPF from "../util/validate-cpf.js";

/**
 * 🔹 Custom validator de CPF (usando a função utilitária existente)
 */
const cpfValidator = (value, helpers) => {
    if (!validateCPF(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

/**
 * 🔹 Schema base (todas as regras, mas sem obrigatoriedade)
 */
const baseUserSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(100)
        .messages({
            "string.base": "O nome deve ser um texto.",
            "string.empty": "O nome é obrigatório.",
            "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
            "string.max": "O nome deve ter no máximo {#limit} caracteres.",
        }),

    cpf: Joi.string()
        .custom(cpfValidator, "Validador de CPF")
        .messages({
            "string.base": "O CPF deve ser um texto.",
            "string.empty": "O CPF é obrigatório.",
            "any.invalid": "CPF inválido.",
        }),

    rfid: Joi.string()
        .allow(null, "")
        .max(64)
        .messages({
            "string.base": "O RFID deve ser um texto.",
            "string.max": "O RFID deve ter no máximo {#limit} caracteres.",
        }),

    senha: Joi.string()
        .allow(null, "")
        .min(6)
        .max(128)
        .messages({
            "string.base": "A senha deve ser um texto.",
            "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
            "string.max": "A senha deve ter no máximo {#limit} caracteres.",
        }),

    role: Joi.string()
        .valid("funcionario", "admin")
        .default("funcionario")
        .messages({
            "any.only": 'O cargo deve ser "funcionario" ou "admin".',
        }),

    ativo: Joi.boolean().default(true),
});

/**
 * 🔹 Schema para criação — torna alguns campos obrigatórios
 */
export const createUserSchema = baseUserSchema.fork(
    ["nome", "cpf"],
    (schema) => schema.required()
);

/**
 * 🔹 Schema para atualização — tudo opcional, mas requer pelo menos 1 campo
 */
export const updateUserSchema = baseUserSchema
    .fork(Object.keys(baseUserSchema.describe().keys), (s) => s.optional())
    .min(1)
    .messages({
        "object.min": "É necessário fornecer ao menos um campo para atualização.",
    });

/**
 * 🔹 Função genérica de validação
 * @param {Object} data - Dados a validar
 * @param {Object} schema - Schema Joi (createUserSchema ou updateUserSchema)
 */
export const validateUser = (data, schema = createUserSchema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return {
            error: error.details.map((d) => d.message),
            value: null,
        };
    }

    return { value, error: null };
};

export default validateUser;
