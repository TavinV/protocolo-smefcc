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

const userUpdateSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(100)
        .messages({
            "string.base": "O nome deve ser um texto.",
            "string.empty": "O nome não pode estar vazio.",
            "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
            "string.max": "O nome deve ter no máximo {#limit} caracteres.",
        }),

    cpf: Joi.string()
        .custom(cpfValidator, "Validador de CPF")
        .messages({
            "string.base": "O CPF deve ser um texto.",
            "string.empty": "O CPF não pode estar vazio.",
            "any.invalid": "CPF inválido.",
        }),

    ativo: Joi.boolean(),
        }).min(1) // impede update vazio
            .messages({
                "object.min": "É necessário informar ao menos um campo para atualização.",
            });

/**
 * Validate user update object using Joi.
 * @param {Object} data - Dados do usuário a validar
 * @returns {Object} - { error: [mensagens] | null, value }
 */
export const validateUserUpdate = (data) => {
    const { error, value } = userUpdateSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return { error: messages };
    }

    return { value, error: null };
};

export default validateUserUpdate;
