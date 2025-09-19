import { conn } from "../config/sequelize.js";
import { DataTypes } from "sequelize";

const favoritaModel = conn.define(
  "favoritas",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receitaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dataAdicionada: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prioridade: {
      type: DataTypes.ENUM("baixa", "media", "alta"),
      defaultValue: "media",
    },
    tentativasPreparo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "favoritas",
  }
);



export default favoritaModel;
