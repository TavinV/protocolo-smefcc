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

// Middleware para "desvincular" todos os Itens desse modelo ao deletar
itemModelSchema.pre("findOneAndDelete", async function (next) {
    const modelBeingDeleted = await this.model.findOne(this.getQuery());
    if (!modelBeingDeleted) return next();

    const Item = mongoose.model("Item");
    await Item.updateMany(
        { modelo: modelBeingDeleted._id },
        { $set: { modelo: null } }
    );

    next();
});

const ItemModel = mongoose.model("ItemModel", itemModelSchema);

export default ItemModel;
