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
 * 🔹 Schema exclusivo para criação de Itens
 * Todos os campos necessários são obrigatórios.
 */
const createItemSchema = Joi.object({
    modelo: Joi.string()
        .required()
        .custom(objectIdValidator, "Validador de ObjectId")
        .messages({
            "any.required": "O modelo é obrigatório.",
            "string.base": "O modelo deve ser um ID válido.",
            "any.invalid": "O modelo informado não é válido.",
        }),

    status: Joi.string()
        .valid("disponível", "em uso")
        .default("disponível")
        .messages({
            "any.only": 'O status deve ser "disponível" ou "em uso".',
        }),
});

/**
 * 🔹 Função genérica de validação (apenas criação)
 * @param {Object} data - Dados do item
 * @returns {Object} - { value, error }
 */
export const validateItem = (data) => {
    const { error, value } = createItemSchema.validate(data, {
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

export default validateItem;
