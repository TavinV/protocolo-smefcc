import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";
import {
    ValidationError,
    NotFoundError,
    ConflictError,
} from "../util/errors.js";

class TransactionService {
    /**
     * Cria uma nova transação (retirada ou devolução)
     * @param {Object} data - Dados da transação
     * @param {String} data.rfid - RFID do usuário que realizou a ação
     * @param {String} data.item - ID do item
     * @param {String} data.tipo - Tipo da transação: 'retirada' ou 'devolucao'
     * @param {String} [data.observacoes] - Observações opcionais
     * @returns {Promise<Transaction>} Transação criada
     */
    async create(data) {
        const { rfid, item, tipo, observacoes } = data;

        if (!["retirada", "devolucao"].includes(tipo)) {
            throw new ValidationError("Tipo de transação inválido");
        }

        const user = await User.findOne({ rfid });
        if (!user) throw new NotFoundError("Usuário não encontrado");

        // Previne conflito: não permitir duas retiradas seguidas do mesmo item
        const lastTx = await this.getLastTransactionByItem(item);
        if (lastTx && lastTx.tipo === "retirada" && tipo === "retirada") {
            throw new ConflictError("O item já está em uso e não foi devolvido");
        }

        // Também não faz sentido devolver sem ter sido retirado antes
        if (!lastTx && tipo === "devolucao") {
            throw new ValidationError("Não é possível devolver um item nunca retirado");
        }

        const transaction = await Transaction.create({
            usuario: {
                id: user._id,
                nome: user.nome,
                cpf: user.cpf,
            },
            item,
            tipo,
            observacoes,
        });

        return transaction;
    }

    /**
     * Lista transações com filtros opcionais
     * @param {Object} filters
     * @returns {Promise<Transaction[]>}
     */
    async read(filters = {}) {
        const query = {};

        if (filters.usuarioId) query["usuario.id"] = filters.usuarioId;
        if (filters.item) query.item = filters.item;
        if (filters.tipo) query.tipo = filters.tipo;
        if (filters.dataInicio || filters.dataFim) query.timestamp = {};
        if (filters.dataInicio) query.timestamp.$gte = filters.dataInicio;
        if (filters.dataFim) query.timestamp.$lte = filters.dataFim;

        return await Transaction.find(query)
            .populate("item")
            .sort({ timestamp: -1 });
    }

    /**
     * Atualiza uma transação existente
     */
    async update(id, data) {
        const transaction = await Transaction.findById(id);
        if (!transaction) throw new NotFoundError("Transação não encontrada");

        if (data.tipo && !["retirada", "devolucao"].includes(data.tipo)) {
            throw new ValidationError("Tipo de transação inválido");
        }

        Object.assign(transaction, data);
        await transaction.save();
        return transaction;
    }

    /**
     * Remove uma transação
     */
    async delete(id) {
        const transaction = await Transaction.findById(id);
        if (!transaction) throw new NotFoundError("Transação não encontrada");

        await transaction.remove();
    }

    // ===============================================================
    // 🧩 Funções úteis para controle de uso
    // ===============================================================

    /**
     * Retorna a última transação registrada de um item
     * @param {String} itemId
     * @returns {Promise<Transaction|null>}
     */
    async getLastTransactionByItem(itemId) {
        return await Transaction.findOne({ item: itemId })
            .sort({ timestamp: -1 })
            .lean();
    }

    /**
     * Retorna se o item está disponível (true) ou emprestado (false)
     * @param {String} itemId
     * @returns {Promise<{ disponivel: boolean, ultimaTransacao?: Transaction }>}
     */
    async getItemStatus(itemId) {
        const lastTx = await this.getLastTransactionByItem(itemId);
        if (!lastTx) return { disponivel: true }; // nunca usado = disponível

        return {
            disponivel: lastTx.tipo === "devolucao",
            ultimaTransacao: lastTx,
        };
    }

    /**
     * Retorna o usuário que está atualmente com o item (caso esteja emprestado)
     * @param {String} itemId
     * @returns {Promise<{ usuario?: Object, desde?: Date }>}
     */
    async getCurrentHolder(itemId) {
        const lastTx = await this.getLastTransactionByItem(itemId);
        if (!lastTx || lastTx.tipo === "devolucao") return {};

        return {
            usuario: lastTx.usuario,
            desde: lastTx.timestamp,
        };
    }

    /**
     * Retorna todos os itens atualmente emprestados
     * @returns {Promise<Transaction[]>}
     */
    async getAllBorrowedItems() {
    try {
        const borrowedItems = await Transaction.aggregate([
            // Ordena do mais recente pro mais antigo
            { $sort: { createdAt: -1 } },

            // Agrupa por item e pega a transação mais recente de cada item
            {
                $group: {
                    _id: "$item",
                    lastTransaction: { $first: "$$ROOT" },
                },
            },

            // Filtra somente as transações onde o último tipo foi "retirada"
            {
                $match: {
                    "lastTransaction.tipo": "retirada",
                },
            },

            // Traz apenas o documento da transação (remove o _id do agrupamento)
            {
                $replaceRoot: { newRoot: "$lastTransaction" },
            },

            // Popula o item vinculado
            {
                $lookup: {
                    from: "items", // nome exato da coleção no MongoDB
                    localField: "item",
                    foreignField: "_id",
                    as: "itemData",
                },
            },
            { $unwind: { path: "$itemData", preserveNullAndEmptyArrays: true } },

            // Popula o usuário vinculado
            {
                $lookup: {
                    from: "users", // nome exato da coleção de usuários
                    localField: "usuario.id",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },

            // Projeta o formato final da resposta
            {
                $project: {
                    _id: 1,
                    tipo: 1,
                    observacoes: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "usuario.id": 1,
                    "usuario.nome": "$userData.nome",
                    "usuario.cpf": "$userData.cpf",
                    "item._id": "$itemData._id",
                    "item.codigoInterno": "$itemData.codigoInterno",
                    "item.status": "$itemData.status",
                    "item.modelo": "$itemData.modelo",
                },
            },
        ]);
    
            // ✅ sempre retorna array — mesmo se vazio ou com 1 item
            return borrowedItems || [];
        } catch (err) {
            console.error("Erro ao buscar itens emprestados:", err);
            return [];
        }
    }

    /**
     * Retorna histórico de transações de um usuário
     * @param {String} usuarioId
     * @returns {Promise<Transaction[]>}
     */
    async getUserHistory(usuarioId) {
        return await Transaction.find({ "usuario.id": usuarioId })
            .populate("item")
            .sort({ timestamp: -1 });
    }

    async deleteAll() {
        await Transaction.deleteMany({});
    }

    /**
     * Retorna estatísticas básicas de um usuário
     * @param {String} usuarioId
     * @returns {Promise<{ totalRetiradas: number, totalDevolucoes: number, itensAtivos: number }>}
     */
    async getUserStats(usuarioId) {
        const [retiradas, devolucoes] = await Promise.all([
            Transaction.countDocuments({ "usuario.id": usuarioId, tipo: "retirada" }),
            Transaction.countDocuments({ "usuario.id": usuarioId, tipo: "devolucao" }),
        ]);

        // Itens ainda com o usuário (retirados e não devolvidos)
        const borrowed = await this.getAllBorrowedItems();
        const ativos = borrowed.filter(
            (t) => String(t.usuario.id) === String(usuarioId)
        ).length;

        return {
            totalRetiradas: retiradas,
            totalDevolucoes: devolucoes,
            itensAtivos: ativos,
        };
    }
}

const transactionService = new TransactionService();
export default transactionService;
