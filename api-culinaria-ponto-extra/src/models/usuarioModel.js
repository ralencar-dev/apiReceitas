import { conn } from "../config/sequelize.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const usuarioModel = conn.define(
  "usuarios",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    tipoUsuario: {
      type: DataTypes.ENUM("comun", "admin"),
      allowNull: false,
    },

    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "usuarios",
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("senha")) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      },
    },
  }
);

usuarioModel.prototype.validarSenha = async function (senha) {
  return await bcrypt.compare(senha, this.senha);
};

export default usuarioModel;
