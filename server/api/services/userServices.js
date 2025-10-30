import User from "../models/userModel.js";
import {
    ValidationError,
    NotFoundError,
    ConflictError,
} from "../util/errors.js";
import bcrypt from "bcrypt";

function stripSensitiveInfo(user) {
    const userObj = user.toObject();
    delete userObj.senha;
    return userObj;
}

class UserService {
    /**
     * Creates a new user
     * @param {Object} data - User data
     * @param {String} data.name - User name
     * @param {String} data.cpf - CPF (must be unique)
     * @param {String} [data.senha] - Optional password (only for staff)
     * @param {String} [data.rfid] - Optional RFID (only for staff)
     * @returns {Promise<User>} Created user
     * @throws {ValidationError} Invalid data
     * @throws {ConflictError} Duplicate CPF or RFID
     */
    async create(data) {
        try {
            const existingCPF = await User.findOne({ cpf: data.cpf });
            if (existingCPF) throw new ConflictError("CPF já cadastrado");

            if (data.rfid) {
                const existingRFID = await User.findOne({ rfid: data.rfid });
                if (existingRFID) throw new ConflictError("RFID já cadastrado");
            }

            if (data.senha) {
                const salt = await bcrypt.genSalt(10);
                data.senha = await bcrypt.hash(data.senha, salt);
            }

            const user = await User.create(data);
            return stripSensitiveInfo(user);
        } catch (err) {
            if (err.name === "ValidationError") throw new ValidationError(err.message);
            throw err;
        }
    }

    /**
     * Returns all users, with optional filters
     * @param {Object} [filters] - Optional filters
     * @returns {Promise<User[]>} List of users
     */
    async read(filters = {}) {
        const query = {};
        if (filters.nome) query.nome = { $regex: filters.nome, $options: "i" };
        if (filters.cpf){
            const cpfFormatted = filters.cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            query.cpf = cpfFormatted;
        }
        if (filters.rfid) query.rfid = filters.rfid;
        
        return await User.find(query).then(users => users.map(stripSensitiveInfo));
    }

    /**
     * Finds a user by ID
     * @param {String} id - User ID
     * @returns {Promise<User>} Found user
     * @throws {NotFoundError} If not found
     */
    async getById(id) {
        const user = await User.findById(id);
        if (!user) throw new NotFoundError("Usuário não encontrado");
        return stripSensitiveInfo(user);
    }

    /**
     * Updates a user
     * @param {String} id - User ID
     * @param {Object} data - Fields to update
     * @returns {Promise<User>} Updated user
     * @throws {NotFoundError} User not found
     * @throws {ConflictError} CPF or RFID duplicate
     */
    async update(id, data) {
        const user = await User.findById(id);
        if (!user) throw new NotFoundError("Usuário não encontrado");

        if (data.cpf && data.cpf !== user.cpf) {
            const existingCPF = await User.findOne({ cpf: data.cpf });
            if (existingCPF) throw new ConflictError("CPF já cadastrado");
        }

        if (data.rfid && data.rfid !== user.rfid) {
            const existingRFID = await User.findOne({ rfid: data.rfid });
            if (existingRFID) throw new ConflictError("RFID já existe");
        }

        if (data.senha) {
            const salt = await bcrypt.genSalt(10);
            data.senha = await bcrypt.hash(data.senha, salt);
        }

        Object.assign(user, data);
        await user.save();
        return stripSensitiveInfo(user);
    }

    /**
     * Deletes a user
     * @param {String} id - User ID
     * @returns {Promise<void>}
     * @throws {NotFoundError} User not found
     */
    async delete(id) {
        const user = await User.findById(id);
        if (!user) throw new NotFoundError("Usuário não encontrado");

        try {
            const result = await User.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                throw new NotFoundError("Usuário não encontrado");
            }
        } catch (error) {
            if (error.name === "NotFoundError") throw error;
            throw new Error("Erro ao deletar usuário");
        }
    }

    /**
     * Finds a user by CPF
     * @param {String} cpf - CPF
     * @returns {Promise<User|null>} Found user or null
     */
    async findByCPF(cpf) {
        const cpfFormatted = cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        const user = await User.findOne({ cpf: cpfFormatted });
        return stripSensitiveInfo(user);
    }

    /**
     * Finds a user by RFID
     * @param {String} rfid - RFID tag
     * @returns {Promise<User|null>} Found user or null
     */
    async findByRFID(rfid) {
        const user = await User.findOne({ rfid });
        return stripSensitiveInfo(user);
    }

    /**
     * Authenticates a user by CPF and password
     * @param {String} cpf - CPF
     * @param {String} senha - Password
     * @returns {Promise<User>} Authenticated user
     * @throws {ValidationError} Invalid credentials
     */
    async authenticate(cpf, senha) {
        const user = await User.findOne({ cpf });
        if (!user || !user.senha)
            throw new ValidationError("Credenciais inválidas");

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) throw new ValidationError("Credenciais inválidas");

        return stripSensitiveInfo(user);
    }

    /**
     * Returns how many users have RFID vs not
     * (useful to separate staff vs normal users)
     * @returns {Promise<{withRFID: number, withoutRFID: number}>}
     */
    async countByRFIDStatus() {
        const [withRFID, withoutRFID] = await Promise.all([
            User.countDocuments({ rfid: { $exists: true, $ne: null } }),
            User.countDocuments({ $or: [{ rfid: { $exists: false } }, { rfid: null }] }),
        ]);
        return { withRFID, withoutRFID };
    }

    /**
     * Attaches an RFID to a user
     * @param {String} id - User ID
     * @param {String} rfid - RFID tag
     * @returns {Promise<User>} Updated user
     */
    async attachRFID(id, rfid) {
        const user = await User.findById(id);
        if (!user) throw new NotFoundError("Usuário não encontrado");

        user.rfid = rfid;
        await user.save();
        return stripSensitiveInfo(user);
    }

    /**
     * Removes RFID from a user (useful when reassigning tags)
     * @param {String} id - User ID
     * @returns {Promise<User>} Updated user
     */
    async removeRFID(id) {
        const user = await User.findById(id);
        if (!user) throw new NotFoundError("Usuário não encontrado");

        user.rfid = null;
        await user.save();
        return stripSensitiveInfo(user);
    }

    /**
     * Bulk updates multiple users by filter
     * @param {Object} filter - MongoDB filter
     * @param {Object} update - Update object
     * @returns {Promise<{modifiedCount: number}>}
     */
    async bulkUpdate(filter, update) {
        const result = await User.updateMany(filter, update);
        return { modifiedCount: result.modifiedCount };
    }
}

const userService = new UserService();
export default userService;
