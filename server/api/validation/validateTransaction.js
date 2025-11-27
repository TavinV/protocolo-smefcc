import Joi from "joi";
import mongoose from "mongoose";

/**
 * 🔹 Validador customizado para ObjectId do Mongoose
 */
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

/**
 * 🔹 Schema para criação de Transações
 */
const createTransactionSchema = Joi.object({
    rfid: Joi.string()
        .required()
        .messages({
            "any.required": "O RFID é obrigatório.",
            "any.invalid": "O RFID informado não é válido.",
        }),

    item: Joi.string()
        .required()
        .messages({
            "any.required": "O item é obrigatório.",
        }),

    tipo: Joi.string()
        .valid("retirada", "devolucao")
        .required()
        .messages({
            "any.only": 'O tipo deve ser "retirada" ou "devolucao".',
            "any.required": "O tipo da transação é obrigatório.",
        }),

    observacoes: Joi.string()
        .trim()
        .max(500)
        .messages({
            "string.max": "As observações devem ter no máximo 500 caracteres.",
        }),
});

/**
 * 🔹 Função de validação
 * @param {Object} data - Dados da transação
 * @returns {Object} - { value, error }
 */
export const validateTransaction = (data) => {
    const { error, value } = createTransactionSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return {
            value: null,
            error: error.details.map((d) => d.message),
        };
    }

    return { value, error: null };
};

export default validateTransaction;
