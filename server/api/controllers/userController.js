import userService from "../services/userServices.js";

import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";

import validateUser from "../validation/validateUser.js";
import validateUserUpdate from "../validation/validateUserUpdate.js";

const userController = {
    async createUser(req, res) {
        try {
            const { error, value } = validateUser(req.body);

            if (error) {
                return ApiResponse.BADREQUEST(res, error[0]);
            }

            // Mascarando o cpf do usuario, caso não esteja mascarado, adicionando os pontos e traços
            if (req.body.cpf) {
                req.body.cpf = req.body.cpf.replace(/\D/g, '');
                req.body.cpf = req.body.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }

            if (req.body.role == "admin") {
                const isMasterKeyValid = req.headers['x-master-key'] === process.env.MASTER_KEY;
                if (!isMasterKeyValid) {
                    return ApiResponse.FORBIDDEN(res, "Não é permitido criar usuários com o cargo de admin");
                }
            }

            const userData = {...value, rfid: req.body.rfid || null };
            const user = await userService.create(userData);

            return ApiResponse.CREATED(res, "Usuário criado com sucesso!", user);
        } catch (err) {
            handleControllerError(err, res);
        }
    },

    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await userService.getById(userId);
            return ApiResponse.OK(res, user);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async getUsers(req, res) {
        try {
            const filters = Object.fromEntries(Object.entries(req.query));
            const users = await userService.read(filters);
            return ApiResponse.OK(res, users);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getById(userId);
            return ApiResponse.OK(res, user);
        } catch (error) {
            return handleControllerError(error, res);
        }},

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            await userService.delete(userId);
            return ApiResponse.DELETED(res, "Usuário deletado com sucesso");
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async attachRFID(req, res) {
        try {
            const userId = req.params.id;
            const { rfid } = req.body;
            const user = await userService.attachRFID(userId, rfid);
            return ApiResponse.OK(res, `RFID ${rfid} associado com sucesso`, user);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async detachRFID(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.removeRFID(userId);
            return ApiResponse.OK(res, "RFID desassociado com sucesso", user);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    async updateUser(req, res) {
        try {
            const {error, value} = validateUserUpdate(req.body);

            if (error) {
                return ApiResponse.BADREQUEST(res, error[0]);
            }

            const userId = req.params.id;
            const data = req.body;
            const user = await userService.update(userId, data);
            return ApiResponse.OK(res, "Usuário atualizado com sucesso", user);
        } catch (error) {
            return handleControllerError(error, res);
        }
    }
};

export default userController;
