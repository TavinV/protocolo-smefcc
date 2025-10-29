import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true,
        },
        cpf: {
            type: String,
            required: true,
            unique: true, 
            trim: true,
        },
        rfid: {
            type: String,
            trim: true,
            unique: true, 
            sparse: true, 
        },
        senha: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["funcionario", "admin"],
            default: "funcionario",
        },
        ativo: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // createdAt e updatedAt
    }
);

const User = mongoose.model("User", userSchema);

export default User;
