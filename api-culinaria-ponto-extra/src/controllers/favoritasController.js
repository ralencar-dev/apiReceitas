import favoritaModel from "../models/favoritaModel.js";
import receitasModel from "../models/receitasModels.js";

export const adicionarFavorita = async (req, res) => {
  const { receitaId, categoria, observacoes, prioridade, tentativasPreparo } = req.body;
  const usuarioId = req.user.id;

  if (!receitaId) return res.status(400).json({ mensagem: "Campo receitaId obrigatório" });

  try {
    const existe = await favoritaModel.findOne({ where: { usuarioId, receitaId } });
    if (existe) return res.status(400).json({ mensagem: "Receita já está nos favoritos" });

    const favorita = await favoritaModel.create({
      usuarioId,
      receitaId,
      categoria,
      observacoes,
      prioridade,
      tentativasPreparo,
    });

    res.status(201).json(favorita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const removerFavorita = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;

  try {
    const favorita = await favoritaModel.findOne({ where: { id, usuarioId } });
    if (!favorita) return res.status(404).json({ mensagem: "Favorita não encontrada" });

    await favorita.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarFavoritasUsuario = async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const favoritas = await favoritaModel.findAll({
      where: { usuarioId },
      include: [{ model: receitasModel }] 
    });

    res.status(200).json(favoritas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const detalhesFavorita = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;

  try {
    const favorita = await favoritaModel.findOne({
      where: { id, usuarioId },
      include: [{ model: receitasModel }]
    });

    if (!favorita) return res.status(404).json({ mensagem: "Favorita não encontrada" });

    res.status(200).json(favorita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarTodasFavoritas = async (req, res) => {
  try {
    const favoritas = await favoritaModel.findAll({ include: [{ model: receitasModel }] });
    res.status(200).json(favoritas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
