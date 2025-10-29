import mongoose from "mongoose";

const rfidPendingSchema = new mongoose.Schema(
    {
        rfid: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        sensorId: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pendente", "usado", "expirado"],
            default: "pendente",
        }
    },
    {
        timestamps: true, // cria createdAt e updatedAt automaticamente
    }
);

// Índices para buscas rápidas
rfidPendingSchema.index({ rfid: 1 });
rfidPendingSchema.index({ status: 1 });

const RfidPending = mongoose.model("RfidPending", rfidPendingSchema);

export default RfidPending;
