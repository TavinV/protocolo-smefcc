import JwtService from "../services/jwtServices.js";
import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";
import userService from "../services/userServices.js";

const authController = {
    async login(req, res) {
        try {
            const { cpf, senha } = req.body;
            const user = await userService.authenticate(cpf, senha);
            const token = JwtService.createToken({
                id: user._id,
                nome: user.nome,
                role: user.role,
            });
            return ApiResponse.OK(res, { token });
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
};

export default authController;