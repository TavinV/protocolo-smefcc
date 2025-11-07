import rfidPendingService from "../services/rfidPendingServices.js";
import ApiResponse from "../util/api-response.js";
import handleControllerError from "../util/error-handler.js";

const rfidPendingController = {
    /**
     * 🔹 Criação de um novo RFID pendente (leitura via sensor)
     */
    async create(req, res) {
        try {
            const { rfid } = req.body;

            if (!rfid) {
                return ApiResponse.BADREQUEST(res, "Campo 'rfid' é obrigatório.");
            }

            const created = await rfidPendingService.create({ rfid });
            return ApiResponse.CREATED(res, created);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    /**
     * 🔹 Lista RFIDs (pode filtrar por status)
     */
    async getAll(req, res) {
        try {
            const filters = req.query || {};
            const rfids = await rfidPendingService.read(filters);
            return ApiResponse.OK(res, rfids);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    /**
     * 🔹 Atualiza o status de um RFID
     */
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!["pendente", "usado", "expirado"].includes(status)) {
                return ApiResponse.BADREQUEST(res, "Status inválido.");
            }

            const updated = await rfidPendingService.updateStatus(id, status);
            return ApiResponse.OK(res, updated);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },

    /**
     * 🔹 Deleta um RFID (feito pelo admin no site)
     */
    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await rfidPendingService.remove(id);
            return ApiResponse.DELETED(res);
        } catch (error) {
            return handleControllerError(error, res);
        }
    },
};

export default rfidPendingController;
