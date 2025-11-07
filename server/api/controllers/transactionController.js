import transactionService from "../services/transactionServices.js";
import itemService from "../services/itemServices.js";
import userService from "../services/userServices.js";
import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";
import validateTransaction from "../validation/validateTransaction.js";

const transactionController = {
    async createTransaction(req, res) {
        try {
            const transactionData = req.body;
            const { error, value } = validateTransaction(transactionData);
            
            if (error) {
                return ApiResponse.BADREQUEST(res, error[0]);
            }

            const user = await userService.findByRFID(value.rfid);
            
            if (!user || user.length === 0) {
                return ApiResponse.BADREQUEST(res, { message: "Usuário inválido" });
            }

            const item = await itemService.read({ _id: value.itemId });
            if (!item || item.length === 0) {
                return ApiResponse.BADREQUEST(res, { message: "Item inválido" });
            }

            if (value.tipo === "devolucao") {
                // Verifica se o item foi retirado antes de permitir a devolução
                const lastTransaction = await transactionService.getLastTransactionByItem(value.item);

                if (!lastTransaction || lastTransaction.length === 0) {
                    return ApiResponse.BADREQUEST(res, { message: "Item não foi retirado" });
                }
                if (lastTransaction.tipo !== "retirada") {
                    return ApiResponse.BADREQUEST(res, { message: "Item já foi devolvido" });
                }
                
                itemService.markAsAvailable(value.item);

            } else if (value.tipo === "retirada") {
                // Verifica se o item já está retirado
                const lastTransaction = await transactionService.getLastTransactionByItem(value.item);

                if (lastTransaction && lastTransaction.tipo === "retirada") {
                    return ApiResponse.BADREQUEST(res, { message: "Item já está retirado" });
                }
                itemService.markAsBorrowed(value.item);
            }

            const transaction = await transactionService.create(value);
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
            const items = await transactionService.getAllBorrowedItems();
            return ApiResponse.OK(res, items);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

};

export default transactionController;