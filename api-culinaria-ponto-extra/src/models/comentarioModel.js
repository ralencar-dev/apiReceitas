import { conn } from "../config/sequelize.js";
import { DataTypes } from "sequelize";
import usuarioModel from "./usuarioModel.js";
import receitasModel from "./receitasModel.js";

const comentarioModel = conn.define(
    "comentarios",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        usuarioId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        receitaId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        avaliacao: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            validate: { min: 1, max: 5 }
        },
        aprovado: {
            type: DataTypes.BOOLEAN, 
            defaultValue: false
        },
    },
    {
        tableName: "comentarios",
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

usuarioModel.hasMany(comentarioModel, { foreignKey: "usuarioId", as: "comentarios" });
comentarioModel.belongsTo(usuarioModel, { foreignKey: "usuarioId", as: "usuario" });

receitasModel.hasMany(comentarioModel, { foreignKey: "receitaId", as: "comentariosReceita" });
comentarioModel.belongsTo(receitasModel, { foreignKey: "receitaId", as: "receita" });

export default comentarioModel;
