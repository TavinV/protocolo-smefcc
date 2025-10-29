import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        usuario: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            nome: {
                type: String,
                required: true,
                trim: true,
            },
            cpf: {
                type: String,
                required: true,
                trim: true,
            },
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
        tipo: {
            type: String,
            enum: ["retirada", "devolucao"],
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        observacoes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Cria createdAt e updatedAt
    }
);

// Índices úteis para buscas rápidas
transactionSchema.index({ "usuario.id": 1 });
transactionSchema.index({ item: 1 });
transactionSchema.index({ timestamp: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
