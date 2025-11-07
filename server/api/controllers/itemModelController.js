import { get } from "mongoose";
import itemModelService from "../services/itemModelServices.js";
import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";

import { validateItemModel, createItemModelSchema, updateItemModelSchema } from "../validation/validateItemModel.js";

const itemModelController = {
    async create(req, res) {
        try {
            const { error, value } = validateItemModel(req.body, createItemModelSchema);

            if (error) {
                return ApiResponse.BADREQUEST(res, { errors: error });
            }

            const itemModel = await itemModelService.create(value);
            return ApiResponse.CREATED(res, itemModel);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
    async getItemModels(req, res) {
        try {
            const itemModels = await itemModelService.read();
            return ApiResponse.OK(res, itemModels);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
    async getItemModel(req, res) {
        try {
            const { id } = req.params;
            const itemModel = await itemModelService.read({_id: id});
            if (!itemModel) {
                return ApiResponse.NOTFOUND(res, { message: "Modelo não encontrado" });
            }
            return ApiResponse.OK(res, itemModel);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
    async updateItemModel(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = validateItemModel(req.body, updateItemModelSchema);
            if (error) {
                return ApiResponse.BADREQUEST(res, { errors: error });
            }

            const itemModel = await itemModelService.update(id, value);
            if (!itemModel) {
                return ApiResponse.NOTFOUND(res, { message: "Modelo não encontrado" });
            }
            return ApiResponse.OK(res, itemModel);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
    async deleteItemModel(req, res) {
        try {
            const { id } = req.params;
            await itemModelService.delete(id);
            return ApiResponse.DELETED(res);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
};

export default itemModelController;