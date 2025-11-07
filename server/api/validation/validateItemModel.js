import Joi from "joi";

// 🔹 Schema base — descreve o modelo completo do item
const baseItemModelSchema = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(100)
        .messages({
            "string.base": "O nome deve ser um texto.",
            "string.empty": "O nome é obrigatório.",
            "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
            "string.max": "O nome deve ter no máximo {#limit} caracteres.",
        }),

    descricao: Joi.string()
        .allow("", null)
        .max(500)
        .messages({
            "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
        }),

    categoria: Joi.string()
        .valid("ferramenta", "EPI", "outros")
        .messages({
            "any.only": "Categoria deve ser 'ferramenta', 'EPI' ou 'outros'.",
        }),

    fabricante: Joi.string()
        .allow("", null)
        .max(100)
        .messages({
            "string.max": "O fabricante deve ter no máximo {#limit} caracteres.",
        }),

    quantidadeTotal: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "A quantidade total deve ser um número inteiro.",
            "number.min": "A quantidade total não pode ser negativa.",
        }),

    quantidadeDisponivel: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "A quantidade disponível deve ser um número inteiro.",
            "number.min": "A quantidade disponível não pode ser negativa.",
        }),

    ativo: Joi.boolean().messages({
        "boolean.base": "O campo 'ativo' deve ser verdadeiro ou falso.",
    }),
});

// 🔹 Schema para criação — campos obrigatórios
export const createItemModelSchema = baseItemModelSchema.fork(
    ["nome", "categoria"],
    (schema) => schema.required()
);

// 🔹 Schema para atualização — tudo opcional, mas requer pelo menos 1 campo
export const updateItemModelSchema = baseItemModelSchema
    .fork(Object.keys(baseItemModelSchema.describe().keys), (s) => s.optional())
    .min(1)
    .messages({
        "object.min": "É necessário fornecer ao menos um campo para atualização.",
    });

// 🔹 Função genérica de validação
export const validateItemModel = (data, schema = createItemModelSchema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false, // mostra todos os erros
        stripUnknown: true, // remove campos não permitidos
    });

    if (error) {
        return {
            error: error.details.map((d) => d.message),
            value: null,
        };
    }

    return { value, error: null };
};
