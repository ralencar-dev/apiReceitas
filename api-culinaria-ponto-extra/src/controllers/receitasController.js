import receitasModel from "../models/receitasModels.js";
import { Op } from "sequelize";

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

