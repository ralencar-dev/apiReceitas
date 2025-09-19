import curtidaModel from "../models/curtidaModel.js";
import receitasModel from "../models/receitasModels.js";
import { Op } from "sequelize";

export const curtirReceita = async (req, res) => {
  const { id: receitaId } = req.params;
  const usuarioId = req.user.id;

  try {
    const existe = await curtidaModel.findOne({ where: { usuarioId, receitaId } });
    if (existe) return res.status(400).json({ mensagem: "Receita já curtida" });

    const curtida = await curtidaModel.create({ usuarioId, receitaId });
    res.status(201).json(curtida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const descurtirReceita = async (req, res) => {
  const { id: receitaId } = req.params;
  const usuarioId = req.user.id;

  try {
    const curtida = await curtidaModel.findOne({ where: { usuarioId, receitaId } });
    if (!curtida) return res.status(404).json({ mensagem: "Curtida não encontrada" });

    await curtida.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarCurtidasUsuario = async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const curtidas = await curtidaModel.findAll({
      where: { usuarioId },
      include: [{ model: receitasModel }],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(curtidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const receitasPopulares = async (req, res) => {
  try {
    const curtidas = await curtidaModel.findAll({
      attributes: [
        "receitaId",
        [curtidaModel.sequelize.fn("COUNT", curtidaModel.sequelize.col("receitaId")), "totalCurtidas"]
      ],
      group: ["receitaId"],
      order: [[curtidaModel.sequelize.fn("COUNT", curtidaModel.sequelize.col("receitaId")), "DESC"]],
      include: [{ model: receitasModel }],
    });

    res.status(200).json(curtidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
