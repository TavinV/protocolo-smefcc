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
     * @param {String} data.usuarioId - ID do usuário que realizou a ação
     * @param {String} data.item - ID do item
     * @param {String} data.tipo - Tipo da transação: 'retirada' ou 'devolucao'
     * @param {String} [data.observacoes] - Observações opcionais
     * @returns {Promise<Transaction>} Transação criada
     */
    async create(data) {
        const { usuarioId, item, tipo, observacoes } = data;

        if (!["retirada", "devolucao"].includes(tipo)) {
            throw new ValidationError("Tipo de transação inválido");
        }

        const user = await User.findById(usuarioId);
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
        const lastTransactions = await Transaction.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$item",
                    lastTransaction: { $first: "$$ROOT" },
                },
            },
            { $match: { "lastTransaction.tipo": "retirada" } },
        ]);

        // Mapeia para formato mais limpo
        return lastTransactions.map((t) => t.lastTransaction);
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
