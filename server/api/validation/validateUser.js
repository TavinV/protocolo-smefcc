import Joi from "joi";
import validateCPF from "../util/validate-cpf.js";

/**
 * Custom Joi validator for CPF using the provided validateCPF function.
 */
const cpfValidator = (value, helpers) => {
    if (!validateCPF(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

const userSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.base": "O nome deve ser um texto.",
            "string.empty": "O nome é obrigatório.",
            "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
            "string.max": "O nome deve ter no máximo {#limit} caracteres.",
            "any.required": "O nome é obrigatório.",
        }),

    cpf: Joi.string()
        .required()
        .custom(cpfValidator, "Validador de CPF")
        .messages({
            "string.base": "O CPF deve ser um texto.",
            "string.empty": "O CPF é obrigatório.",
            "any.invalid": "CPF inválido.",
            "any.required": "O CPF é obrigatório.",
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
 * Validate a user object using Joi.
 * @param {Object} data - Dados do usuário a validar
 * @returns {Object} - { error: [mensagens] | null, value }
 */
export const validateUser = (data) => {
    const { error, value } = userSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return { error: messages };
    }

    return { value, error: null };
};

export default validateUser;
