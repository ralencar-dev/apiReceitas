import receitasModel from "../models/receitasModels.js";
import { Op } from "sequelize";

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, unlinkSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cadastrarReceita = async (req, res) => {
    const {
        titulo,
        descricao,
        ingredientes,
        modoPreparo,
        tempoPreparo,
        porcoes,
        dificuldade,
        chefs_id
    } = req.body;

    // Validações
    if (!titulo) {
        return res.status(400).json({ error: "Campo titulo precisa ser preenchido", mensagem: "Erro de campo" });
    }
    if (!descricao) {
        return res.status(400).json({ error: "Campo descricao precisa ser preenchido", mensagem: "Erro de campo" });
    }
    if (!ingredientes) {
        return res.status(400).json({ error: "Campo ingredientes precisa ser preenchido", mensagem: "Erro de campo" });
    }
    if (!modoPreparo) {
        return res.status(400).json({ error: "Campo modo preparo precisa ser preenchido", mensagem: "Erro de campo" });
    }
    if (!tempoPreparo) {
        return res.status(400).json({ error: "Campo tempo preparo precisa ser preenchido", mensagem: "Erro de campo" });
    }
    if (!porcoes) {
        return res.status(400).json({ error: "Campo porções precisa ser preenchido", mensagem: "Erro de campo" });
    }
    if (!dificuldade) {
        return res.status(400).json({ error: "Campo dificuldade precisa ser preenchido", mensagem: "Erro de campo" });
    }
    if (!chefs_id) {
        return res.status(400).json({ error: "Campo chef id precisa ser preenchido", mensagem: "Erro de campo" });
    }


    const receita = {
        titulo,
        descricao,
        ingredientes,
        modoPreparo,
        tempoPreparo,
        porcoes,
        dificuldade,
        chefs_id

    };

    try {
        const novaReceita = await receitasModel.create(receita);
        res.status(200).json(novaReceita);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

export const buscarReceita = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ mensagem: "id invalido" })
    }


    try {

        const receita = await receitasModel.findByPk(id)
        res.status(200).json(receita)

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: "Internal server error" })
    }
};

export const buscarTodasReceitas = async (req, res) => {
    {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (pagina - 1) * limit;

            const receitas = await receitasModel.findAndCountAll({
                offset,
                limit
            });

            console.log("total:", receitas.count);
            console.log("informacoes:", receitas.rows);

            const totalDePaginas = Math.ceil(receitas.count / limit);

            res.status(200).json({
                totalDePaginas,
                paginaAtual: pagina,
                receitasPorPagina: limit,
                receitas: receitas.rows
            });

        } catch (error) {
            console.error("Erro ao buscar receitas:", error);
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    };
};

export const buscarReceitaChef = async (req, res) => {
    const { chefs_id, titulo, dificuldade, tempoMin, tempoMax } = req.query;

    try {
        if (!chefs_id) {
            return res.status(400).json({ mensagem: "ID do chef não fornecido" });
        }

        // Montando os filtros dinamicamente
        const where = { chefs_id };

        if (titulo) {
            where.titulo = { [Op.like]: `%${titulo}%` };
        }

        if (dificuldade) {
            where.dificuldade = dificuldade;
        }

        if (tempoMin || tempoMax) {
            where.tempoPreparo = {};
            if (tempoMin) where.tempoPreparo[Op.gte] = tempoMin;
            if (tempoMax) where.tempoPreparo[Op.lte] = tempoMax;
        }

        const receitas = await receitasModel.findAll({
            where,
            order: [["titulo", "ASC"]] // Ordenação opcional
        });

        if (receitas.length === 0) {
            return res.status(404).json({ mensagem: "Nenhuma receita encontrada com os filtros fornecidos" });
        }

        res.status(200).json(receitas);

    } catch (error) {
        console.error("Erro ao buscar receitas por chef:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

export const atualizarReceita = async (req, res) => {
    const { id } = req.params
    const { titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, chefs_id } = req.body

    try {

        const receitas = await receitasModel.findByPk(id)


        if (!titulo) {
            res.status(400).json({
                error: "preencha o campo titulo",
                mensagem: "Erro de campo"
            })
            return
        }

        if (!descricao) {
            res.status(400).json({
                error: "preencha o campo descricao",
                mensagem: "Erro de campo"
            })
            return
        }
        if (!modoPreparo) {
            res.status(400).json({
                error: "preencha o campo modo de preparo",
                mensagem: "Erro de campo"
            })
            return
        }
        if (!tempoPreparo) {
            res.status(400).json({
                error: "preencha o campo tempo experiencia",
                mensagem: "Erro de campo"
            })
        }
        if (!dificuldade) {
            res.status(400).json({
                error: "preencha o campo dificuldades",
                mensagem: "Erro de campo"
            })
            return
        }
        if (!chefs_id) {
            res.status(400).json({
                error: "preencha o campo chef id",
                mensagem: "Erro de campo"
            })
            return
        }
        if (!porcoes) {
            res.status(400).json({
                error: "preencha o campo porcoes",
                mensagem: "Erro de campo"
            })
            return
        }

        receitas.titulo = titulo
        receitas.descricao = descricao
        receitas.ingredientes = ingredientes
        receitas.modoPreparo = modoPreparo
        receitas.tempoPreparo = tempoPreparo
        receitas.porcoes = porcoes
        receitas.dificuldade = dificuldade
        receitas.chefs_id = chefs_id

        await receitas.save()

        res.status(200).json(receitas)

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: "Internal server error" })
    }
};

export const deletarReceita = async (req, res) => {
    const { id } = req.params

    try {

        const receitas = await receitasModel.findByPk(id)

        if (!id) {
            return res.status(400).json({ mensagem: 'id invalido' })
        }


        await receitasModel.destroy({
            where: { id: receitas.id }
        });

        res.status(204).send();
        console.log(`receita com id ${id} deletado com sucesso!👍`)

    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

export const uploadImagemReceita = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ mensagem: "O id é obrigatório" });
    }
  
    if (!req.file) {
      return res.status(400).json({ mensagem: "Nenhuma imagem enviada" });
    }
  
    const { filename, path: filePath, mimetype, size } = req.file;
  
    const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!tiposPermitidos.includes(mimetype)) {
      return res.status(400).json({
        mensagem: "Formato de arquivo inválido. Apenas JPG, PNG e WEBP são aceitos",
      });
    }
  
    const limiteTamanho = 5 * 1024 * 1024;
    if (size > limiteTamanho) {
      return res.status(400).json({
        mensagem: "Tamanho máximo permitido é 5MB",
      });
    }
  
    try {
      const receita = await receitasModel.findByPk(id);
  
      if (!receita) {
        return res.status(404).json({ mensagem: "Receita não encontrada" });
      }
  
      if (receita.imagem_nome) {
        const caminhoAntigo = path.join(__dirname, "../../public/receitas", receita.imagem_nome);
        if (existsSync(caminhoAntigo)) {
          unlinkSync(caminhoAntigo);
        }
      }
  
      receita.imagem_nome = filename;
      receita.imagem_url = filePath;
  
      await receita.save();
  
      return res.status(200).json({
        mensagem: "Imagem da receita atualizada com sucesso",
        receita,
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  };

  export const buscarImagemReceita = (req, res) => {
    const { filename } = req.params;
    const caminho = path.join(__dirname, "../../public/receitas", filename);
  
    if (!existsSync(caminho)) {
      return res.status(404).json({ mensagem: "Imagem não encontrada" });
    }
  
    return res.sendFile(caminho);
  };
  
  export const deletarImagemReceita = async (req, res) => {
    const { id } = req.params;
  
    try {
      const receita = await receitasModel.findByPk(id);
  
      if (!receita) {
        return res.status(404).json({ mensagem: "Receita não encontrada" });
      }
  
      if (!receita.imagem_nome) {
        return res.status(400).json({ mensagem: "A receita não possui imagem cadastrada" });
      }
  
      const caminho = path.join(__dirname, "../../public/receitas", receita.imagem_nome);
  
      if (existsSync(caminho)) {
        unlinkSync(caminho);
      }
  
      receita.imagem_nome = null;
      receita.imagem_url = null;
      await receita.save();
  
      return res.status(200).json({ mensagem: "Imagem da receita removida com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar imagem da receita:", error);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  };

