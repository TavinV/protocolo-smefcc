import Item from "../models/itemModelModel.js";
import {
    ValidationError,
    NotFoundError,
    ConflictError,
} from "../util/errors.js";

class ItemService {
    /**
     * Creates a new item
     * @param {Object} data - Item data
     * @param {String} data.modelo - Model ID
     * @param {String} [data.codigoInterno] - Optional internal code
     * @param {String} [data.rfid] - Optional RFID
     * @param {String} [data.status] - Initial status
     * @param {String} [data.localizacao] - Initial location
     * @returns {Promise<Item>} Created item
     */
    async create(data) {
        try {
            const existingCodigo = data.codigoInterno
                ? await Item.findOne({ codigoInterno: data.codigoInterno })
                : null;
            if (existingCodigo) throw new ConflictError("Internal code already exists");

            const existingRFID = data.rfid
                ? await Item.findOne({ rfid: data.rfid })
                : null;
            if (existingRFID) throw new ConflictError("RFID already exists");

            const item = await Item.create(data);
            return item;
        } catch (err) {
            if (err.name === "ValidationError") throw new ValidationError(err.message);
            throw err;
        }
    }

    /**
     * Reads items with optional filters
     * @param {Object} filters - Optional filters
     * @returns {Promise<Item[]>} List of items
     */
    async read(filters = {}) {
        const query = {};
        if (filters.modelo) query.modelo = filters.modelo;
        if (filters.status) query.status = filters.status;
        if (typeof filters.ativo === "boolean") query.ativo = filters.ativo;
        if (filters.codigoInterno) query.codigoInterno = filters.codigoInterno;
        if (filters.rfid) query.rfid = filters.rfid;

        return await Item.find(query).populate("modelo");
    }

    /**
     * Updates an existing item
     * @param {String} id - Item ID
     * @param {Object} data - Update data
     * @returns {Promise<Item>} Updated item
     */
    async update(id, data) {
        const item = await Item.findById(id);
        if (!item) throw new NotFoundError("Item not found");

        if (data.codigoInterno && data.codigoInterno !== item.codigoInterno) {
            const existingCodigo = await Item.findOne({ codigoInterno: data.codigoInterno });
            if (existingCodigo) throw new ConflictError("Internal code already exists");
        }

        if (data.rfid && data.rfid !== item.rfid) {
            const existingRFID = await Item.findOne({ rfid: data.rfid });
            if (existingRFID) throw new ConflictError("RFID already exists");
        }

        Object.assign(item, data);
        await item.save();
        return item;
    }

    /**
     * Deletes an item
     * @param {String} id - Item ID
     * @returns {Promise<void>}
     */
    async delete(id) {
        const item = await Item.findById(id);
        if (!item) throw new NotFoundError("Item not found");

        await item.remove();
    }

    /**
     * Marks an item as borrowed (loaned out)
     * @param {String} id - Item ID
     * @param {String} [location] - Optional location to update
     * @returns {Promise<Item>} Updated item
     */
    async markAsBorrowed(id, location) {
        const item = await Item.findById(id);
        if (!item) throw new NotFoundError("Item not found");

        item.status = "borrowed";
        if (location) item.localizacao = location;

        await item.save();
        return item;
    }

    /**
     * Marks an item as available (returned)
     * @param {String} id - Item ID
     * @param {String} [location] - Optional location to update
     * @returns {Promise<Item>} Updated item
     */
    async markAsAvailable(id, location) {
        const item = await Item.findById(id);
        if (!item) throw new NotFoundError("Item not found");

        item.status = "available";
        if (location) item.localizacao = location;

        await item.save();
        return item;
    }

    /**
     * Finds an item by its RFID
     * @param {String} rfid - RFID tag
     * @returns {Promise<Item|null>} Found item or null
     */
    async findByRFID(rfid) {
        return await Item.findOne({ rfid }).populate("modelo");
    }

    /**
     * Finds an item by its internal code
     * @param {String} codigoInterno - Internal code
     * @returns {Promise<Item|null>} Found item or null
     */
    async findByInternalCode(codigoInterno) {
        return await Item.findOne({ codigoInterno }).populate("modelo");
    }

    /**
     * Counts items by status
     * @returns {Promise<Object>} Object with counts per status
     */
    async countByStatus() {
        const aggregation = await Item.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const result = {};
        aggregation.forEach(({ _id, count }) => (result[_id] = count));
        return result;
    }

    /**
     * Bulk update multiple items by filter
     * @param {Object} filter - MongoDB filter
     * @param {Object} update - Update object
     * @returns {Promise<{modifiedCount: number}>}
     */
    async bulkUpdate(filter, update) {
        const result = await Item.updateMany(filter, update);
        return { modifiedCount: result.modifiedCount };
    }
}

const itemService = new ItemService();
export default itemService;
