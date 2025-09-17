import { DataTypes } from "sequelize";
import { conn } from "../config/sequelize.js";

 const chefsModel = conn.define(
    "chefs",
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },

        biografia: {
            type: DataTypes.STRING,
            allowNull: false
        },
        especialidade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experiencia: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nacionalidade: {
            type: DataTypes.STRING,
            allowNull: false
        },

    },


    {
        tableName: "chefs",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "upadate_at"
    }
)

export default chefsModel;