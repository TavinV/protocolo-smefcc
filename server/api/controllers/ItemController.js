import itemService from "../services/itemServices.js";
import itemModelService from "../services/itemModelServices.js";
import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";

import validateItem from "../validation/validateItem.js";

const itemController = {
    async create(req, res) {
        try {
            const { error, value } = validateItem(req.body);
            if (error) {
                return ApiResponse.BADREQUEST(res, error[0]);
            }

            const itemModel = await itemModelService.read({ _id: value.modelo });
            if (!itemModel || itemModel.length === 0) {
                return ApiResponse.BADREQUEST(res, { message: "Modelo inválido" });
            }

            const item = await itemService.create(value);
            return ApiResponse.CREATED(res, item);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async getItems(req, res) {
        try {
            const filters = req.query || {};
            const items = await itemService.read(filters);
            return ApiResponse.OK(res, items);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
    async getItemById(req, res) {
        try {
            const { id } = req.params;
            const items = await itemService.read({ _id: id });
            if (!items || items.length === 0) {
                return ApiResponse.NOTFOUND(res, { message: "Item não encontrado" });
            }
            return ApiResponse.OK(res, items[0]);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async deleteItem(req, res) {
        try {
            const { id } = req.params;
            await itemService.delete(id);
            return ApiResponse.DELETED(res);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
};

export default itemController;