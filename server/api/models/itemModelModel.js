import mongoose from "mongoose";

const itemModelSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        descricao: {
            type: String,
            trim: true,
        },
        categoria: {
            type: String,
            enum: ["ferramenta", "EPI", "outros"],
            required: true,
        },
        fabricante: {
            type: String,
            trim: true,
        },
        quantidadeTotal: {
            type: Number,
            default: 0,
        },
        quantidadeDisponivel: {
            type: Number,
            default: 0,
        },
        ativo: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

itemModelSchema.index({ nome: "text", descricao: "text", fabricante: "text" });

const ItemModel = mongoose.model("ItemModel", itemModelSchema);

export default ItemModel;
