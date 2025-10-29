import mongoose from "mongoose";
import ItemModel from "./itemModelModel.js";

const itemSchema = new mongoose.Schema({
    codigoInterno: {
        type: String,
        unique: true,
        required: true,
    },
    modelo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemModel",
        required: true,
    },
    status: {
        type: String,
        enum: ["disponível", "em uso"],
        default: "disponível",
    },
}, { timestamps: true });

// Função auxiliar para gerar prefixo a partir do nome
function gerarPrefixo(nome) {
    // Pega até 4 primeiras letras maiúsculas sem espaços
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, '')             // remove espaços
        .substring(0, 4)
        .toUpperCase();
}

// Middleware pre-save para gerar código incremental
itemSchema.pre("save", async function (next) {
    if (this.codigoInterno) return next(); // já tem código

    try {
        // Busca o modelo do item
        const modelo = await ItemModel.findById(this.modelo);
        if (!modelo) throw new Error("Modelo não encontrado");

        const prefixo = gerarPrefixo(modelo.nome);

        // Busca o último item com esse prefixo
        const ultimoItem = await mongoose.model("Item").findOne({
            codigoInterno: new RegExp(`^${prefixo}-\\d+$`)
        }).sort({ codigoInterno: -1 });

        let novoNumero = 1;
        if (ultimoItem) {
            const ultimoCodigo = ultimoItem.codigoInterno;
            const numeroStr = ultimoCodigo.split("-")[1];
            const numeroInt = parseInt(numeroStr, 10);
            novoNumero = numeroInt + 1;
        }

        this.codigoInterno = `${prefixo}-${String(novoNumero).padStart(5, "0")}`;
        next();
    } catch (err) {
        next(err);
    }
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
