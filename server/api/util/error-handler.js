import {
    ValidationError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    AppError,
} from "./errors.js";
import ApiResponse from "./api-response.js";

/**
 * Handles service/controller errors consistently across the app.
 * @param {Error} err - The error thrown by a service or controller
 * @param {Response} res - Express response object
 */
export default function handleControllerError(err, res) {
    if (err instanceof ValidationError) {
        return ApiResponse.BADREQUEST(res, err.message);
    } else if (err instanceof NotFoundError) {
        return ApiResponse.NOTFOUND(res, err.message);
    } else if (err instanceof ConflictError) {
        return ApiResponse.CONFLICT(res, err.message);
    } else if (err instanceof UnauthorizedError) {
        return ApiResponse.UNAUTHORIZED(res, err.message);
    } else if (err instanceof ForbiddenError) {
        return ApiResponse.FORBIDDEN(res, err.message);
    } else if (err instanceof AppError) {
        return ApiResponse.ERROR(res, err.message);
    } else {
        console.error("Unhandled error:", err);
        return ApiResponse.ERROR(res, "Internal server error");
    }
}
