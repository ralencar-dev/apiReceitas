import chefsModel from "../models/chefsModel.js";

export const buscarTodosChefs = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (pagina - 1) * limit;

        const chefs = await chefsModel.findAndCountAll({
            offset,
            limit
        });

        console.log("total:", chefs.count);
        console.log("informacoes:", chefs.rows);

        const totalDePaginas = Math.ceil(chefs.count / limit);

        res.status(200).json({
            totalDePaginas,
            paginaAtual: pagina,
            chefsPorPagina: limit,
            chefs: chefs.rows
        });

    } catch (error) {
        console.error("Erro ao buscar chefs:", error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

export const criarChef = async (req, res) => {
    const { nome, biografia, especialidade, experiencia, nacionalidade } = req.body

    if (!nome) {
        res.status(400).json({
            error: "Campo nome precisa ser preenchido",
            mensagem: "Error de campo"
        })

    }
    if (!biografia) {
        res.status(400).json({
            error: "Campo biografia precisa ser preenchido",
            mensagem: "Error de campo"
        })

    }
    if (!especialidade) {
        res.status(400).json({
            error: "Campo especialidade precisa ser preenchido",
            mensagem: "Error de campo"
        })

    }
    if (!experiencia) {
        res.status(400).json({
            error: "Campo experiencia precisa ser preenchido",
            mensagem: "Error de campo"
        })

    }
    if (!nacionalidade) {
        res.status(400).json({
            error: "Campo nacionalidade precisa ser preenchido",
            mensagem: "Error de campo"
        })

    }

    const chefs = {
        nome,
        biografia,
        especialidade,
        experiencia,
        nacionalidade
    }

    try {

        const novoChef = chefsModel.create(chefs)
        res.status(200).json(novoChef)

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: 'error interno do servidor' })
    }
};

export const buscarChef = async (req, res) => {
    const {id} = req.params

    if(!id){
        res.status(400).json({
            mensagem: "campo id vazio ou id invalido"
        })
    }

    try {

        const chefs = await chefsModel.findByPk(id)
        res.status(200).json(chefs)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: 'error interno do servidor' })
    }
};

export const atualizarChef = async (req, res) => {
    const { id } = req.params
    const {nome, biografia, especialidade, experiencia, nacionalidade} = req.body

    try {

        const chefs = await chefsModel.findByPk(id)

        if(!nome){
            res.status(400).json({
                error: "preencha o campo nome",
                mensagem: "Erro de campo"
            })
            return
        }

        if(!biografia){
            res.status(400).json({
                error: "preencha o campo biografia",
                mensagem: "Erro de campo"
            })
            return
        }
        if(!especialidade){
            res.status(400).json({
                error: "preencha o campo especialidade",
                mensagem: "Erro de campo"
            })
            return
        }
        if(!experiencia){
            res.status(400).json({
                error: "preencha o campo experiencia",
                mensagem: "Erro de campo"
            })
        }
        if(!nacionalidade){
            res.status(400).json({
                error: "preencha o campo nacionalidade",
                mensagem: "Erro de campo"
            })
            return
        }

        chefs.nome = nome
        chefs.biografia = biografia
        chefs.especialidade = especialidade
        chefs.experiencia = experiencia
        chefs.nacionalidade = nacionalidade

        await chefs.save()

        res.status(200).json(chefs)

        
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: 'error interno do servidor' })
    }
};

export const deletarChef = async (req, res) => {
    const {id} = req.params

    try {

        const chef = await chefsModel.findByPk(id)

        await chefsModel.destroy({
            where: { id: chef.id }
        });

        res.status(204).send();
        console.log(`chef com id ${id} deletado com sucesso!👍`)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: 'error interno do servidor' })
    }
};