import ApiResponse from "../util/api-response.js";
const xApiKey = process.env.X_API_KEY;

export const authenticateXApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== xApiKey) {
        return ApiResponse.UNAUTHORIZED(res, 'Chave API inválida ou ausente');
    }
    next();
};