import transactionService from "../services/transactionServices.js";
import itemService from "../services/itemServices.js";
import userService from "../services/userServices.js";
import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";
import validateTransaction from "../validation/validateTransaction.js";

const transactionController = {
    async createTransaction(req, res) {
        try {
            const { error, value } = validateTransaction(req.body);
            if (error) return ApiResponse.BADREQUEST(res, error[0]);

            // ✅ Busca o usuário via RFID
            const user = await userService.findByRFID(value.rfid);
            if (!user) return ApiResponse.BADREQUEST(res, { message: "Usuário inválido" });

            const item = await itemService.read({ _id: value.item });
            const selectedItem = Array.isArray(item) ? item[0] : item;
            if (!selectedItem) return ApiResponse.BADREQUEST(res, { message: "Item inválido" });

            // Verifica estado anterior do item
            const lastTx = await transactionService.getLastTransactionByItem(value.item);
            if (value.tipo === "devolucao") {
                if (!lastTx || lastTx.tipo !== "retirada")
                    return ApiResponse.BADREQUEST(res, { message: "Item não foi retirado ou já devolvido" });
                await itemService.markAsAvailable(value.item);
            } else if (value.tipo === "retirada") {
                if (lastTx && lastTx.tipo === "retirada")
                    return ApiResponse.BADREQUEST(res, { message: "Item já está retirado" });
                await itemService.markAsBorrowed(value.item);
            }

            // ✅ Passa o usuário diretamente
            const transaction = await transactionService.create({
                user,
                item: value.item,
                tipo: value.tipo,
                observacoes: value.observacoes || "",
            });

            return ApiResponse.CREATED(res, transaction);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async getTransactions(req, res) {
        try {
            const filters = req.query || {};
            const transactions = await transactionService.read(filters);
            return ApiResponse.OK(res, transactions);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async getTransactionById(req, res) {
        try {
            const { id } = req.params;
            const transactions = await transactionService.read({ _id: id });
            if (!transactions || transactions.length === 0) {
                return ApiResponse.NOTFOUND(res, { message: "Transação não encontrada" });
            }
            return ApiResponse.OK(res, transactions[0]);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async getLastTransactionByItemId(req, res) {
        try {
            const { itemId } = req.params;
            const transaction = await transactionService.getLastTransactionByItem(itemId);
            if (!transaction) {
                return ApiResponse.NOTFOUND(res, { message: "Transação não encontrada" });
            }
            return ApiResponse.OK(res, transaction);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async getAllBorrowedItems(req, res) {
        try {
            const transactions = await transactionService.getAllBorrowedItems();
            return ApiResponse.OK(res, transactions);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

};

export default transactionController;