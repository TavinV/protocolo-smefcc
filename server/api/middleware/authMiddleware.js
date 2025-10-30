import JwtService from "../services/jwtServices.js";
import ApiResponse from "../util/api-response.js";

import { ValidationError } from "../util/errors.js";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        const token = JwtService.extractTokenFromHeader(authHeader);
        const decoded = JwtService.verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof ValidationError) {
            return ApiResponse.UNAUTHORIZED(res, error.message);
        }
        return ApiResponse.ERROR(res, error.message);
    }
};

/**
 * Middleware para verificar se o usuário tem o cargo exigido
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

            if (!req.user) {
                return ApiResponse.UNAUTHORIZED(res, 'Usuário não autenticado');
            }

            if (!req.user.role || !rolesArray.includes(req.user.role)) {
                return ApiResponse.FORBIDDEN(res, 'Acesso negado: você não tem permissão para acessar este recurso');
            }

            next();
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            return ApiResponse.ERROR(res, 'Erro interno do servidor');
        };
    };
};

export const authAndRole = (allowedRoles) => {
    return [authenticateToken, requireRole(allowedRoles)];
}