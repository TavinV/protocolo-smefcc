import ItemModelModel from "../models/itemModelModel.js";
import {
    ValidationError,
    NotFoundError,
    ConflictError,
} from "../util/errors.js";

class ItemModelService {
    /**
     * Cria um novo modelo de item
     * @param {Object} data - Objeto contendo os dados do modelo a ser criado
     * @param {String} data.nome - Nome do modelo (obrigatório)
     * @param {String} [data.descricao] - Descrição do modelo (opcional)
     * @param {String} [data.categoria] - Categoria do modelo, ex: 'ferramenta', 'EPI', 'outros'
     * @param {String} [data.fabricante] - Fabricante do modelo (opcional)
     * @param {String} [data.codigoModelo] - Código único do modelo (opcional)
     * @param {Boolean} [data.ativo] - Indica se o modelo está ativo (opcional, padrão: true)
     * @returns {Promise<ItemModelModel>} Retorna o documento do modelo criado
     * @throws {ValidationError} Caso os dados sejam inválidos
     * @throws {ConflictError} Caso já exista um modelo com o mesmo nome ou código
     */
    async create(data) {
        try {
            const existing = await ItemModelModel.findOne({ nome: data.nome });
            if (existing) throw new ConflictError("Nome de modelo já existe");

            const itemModel = await ItemModelModel.create(data);
            return itemModel;
        } catch (err) {
            if (err.name === "ValidationError") throw new ValidationError(err.message);
            throw err;
        }
    }

    /**
     * Lista modelos de itens com filtros opcionais
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<ItemModelModel[]>} Lista de modelos
     */
    async read(filters = {}) {
        const query = {};
        if (filters.nome) query.nome = { $regex: filters.nome, $options: "i" };
        if (filters.categoria) query.categoria = filters.categoria;
        if (typeof filters.ativo === "boolean") query.ativo = filters.ativo;

        return await ItemModelModel.find(query);
    }

    /**
     * Atualiza um modelo de item
     * @param {String} id - ID do modelo
     * @param {Object} data - Campos a atualizar
     * @returns {Promise<ItemModelModel>} Modelo atualizado
     */
    async update(id, data) {
        const itemModel = await ItemModelModel.findById(id);
        if (!itemModel) throw new NotFoundError("Modelo não encontrado");

        Object.assign(itemModel, data);
        await itemModel.save();
        return itemModel;
    }

    /**
     * Remove um modelo de item
     * @param {String} id - ID do modelo
     * @returns {Promise<void>}
     */
    async delete(id) {
        const itemModel = await ItemModelModel.findById(id);
        if (!itemModel) throw new NotFoundError("Modelo não encontrado");

        await itemModel.remove();
    }
}

const itemModelService = new ItemModelService();
export default itemModelService;
