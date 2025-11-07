import RfidPending from "../models/rfidPendingModel.js";
import { NotFoundError } from "../util/errors.js";

const rfidPendingService = {
    /**
     * 🔹 Cria um novo registro de RFID pendente
     * @param {Object} data - Dados do RFID (rfid, sensorId)
     */
    async create(data) {
        const rfid = await RfidPending.create(data);
        return rfid;
    },

    /**
     * 🔹 Lista todos os RFIDs pendentes (ou por status)
     * @param {Object} filters - Filtros opcionais (ex: { status: "pendente" })
     */
    async read(filters = {}) {
        const rfids = await RfidPending.find(filters).sort({ createdAt: -1 });
        return rfids;
    },

    /**
     * 🔹 Busca um RFID específico pelo ID ou valor do rfid
     */
    async readOne(query) {
        const rfid = await RfidPending.findOne(query);
        if (!rfid) throw new NotFoundError("RFID não encontrado");
        return rfid;
    },

    /**
     * 🔹 Atualiza o status de um RFID (ex: usado, expirado)
     */
    async updateStatus(rfidId, newStatus) {
        const updated = await RfidPending.findByIdAndUpdate(
            rfidId,
            { status: newStatus },
            { new: true }
        );
        if (!updated) throw new NotFoundError("RFID não encontrado para atualização");
        return updated;
    },

    /**
     * 🔹 Remove um RFID do banco (usado pelo admin)
     */
    async remove(rfidId) {
        const deleted = await RfidPending.findByIdAndDelete(rfidId);
        if (!deleted) throw new NotFoundError("RFID não encontrado para exclusão");
        return deleted;
    },
};

export default rfidPendingService;
