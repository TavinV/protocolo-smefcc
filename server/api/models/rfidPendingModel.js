import mongoose from "mongoose";

const rfidPendingSchema = new mongoose.Schema(
    {
        rfid: {
            type: String,
            required: true,
            unique: true, // já cria índice único
            trim: true,
        },
        status: {
            type: String,
            enum: ["pendente", "usado", "expirado"],
            default: "pendente",
        },
    },
    {
        timestamps: true, // cria createdAt e updatedAt automaticamente
    }
);

// Índice adicional (somente onde necessário)
rfidPendingSchema.index({ status: 1 }); // mantém apenas este

const RfidPending = mongoose.model("RfidPending", rfidPendingSchema);

export default RfidPending;
