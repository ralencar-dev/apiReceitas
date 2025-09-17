import { DataTypes } from "sequelize";
import { conn } from "../config/sequelize.js";
import chefsModel from "./chefsModel.js";

const receitasModel = conn.define(
    "receitas", 
    {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ingredientes: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modoPreparo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tempoPreparo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        porcoes: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dificuldade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        chefs_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: chefsModel,
                key: 'id'
            }
        }
    }, 
    {
        timestamps: true,
        tableName: "receitas",
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

chefsModel.belongsToMany(receitasModel, {through: 'chefs_id'})
receitasModel.belongsToMany(chefsModel, {through: 'chefs_id'})

export default receitasModel;