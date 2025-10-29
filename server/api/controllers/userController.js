import userService from "../services/userServices.js";
import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";
import validateUser from "../validation/validateUser.js";

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

            const user = await userService.create(req.body);
            console.log(req.body)
            console.log(user)
            return ApiResponse.CREATED(res, "Usuário criado com sucesso!", user);
        } catch (err) {
            handleControllerError(err, res);
        }
    }
};

export default userController;
