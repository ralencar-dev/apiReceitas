import usuarioModel from "../models/usuarioModel.js";



export const registroUsuario = async (req, res) => {
    const { nome, email, senha, telefone, endereco, tipoUsuario, ativo } = req.body

    if (!nome) {
        res.status(400).json({
            mensagem: "campo nome obrigatorio"
        })
    }
    if (!email) {
        res.status(400).json({
            mensagem: "campo email obrigatorio"
        })
    }
    if (!senha) {
        res.status(400).json({
            mensagem: "campo senha obrigatorio"
        })
    }
    if (!telefone) {
        res.status(400).json({
            mensagem: "campo telefone obrigatorio"
        })
    }
    if (!endereco) {
        res.status(400).json({
            mensagem: "campo endereco obrigatorio"
        })
    }
    if (!tipoUsuario) {
        res.status(400).json({
            mensagem: "campo tipo usuario obrigatorio"
        })
    }
    if (!ativo) {
        res.status(400).json({
            mensagem: "campo ativo obrigatorio"
        })
    }

    const novoUsuario = {
        nome,
        email,
        senha,
        telefone,
        endereco,
        tipoUsuario,
        ativo
    }

    try {

        const usuario = await usuarioModel.create(novoUsuario)
        res.status(201).json(usuario)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensagem: "internal server error"
        })
    }

}

export const buscarPerfil = async (req, res) => {
    try {
        const usuario = await usuarioModel.findByPk(req.user.id, {
            attributes: { exclude: ["senha"] },
        });

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

export const atualizarPerfil = async (req, res) => {
    const { nome, telefone, endereco } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "campo nome obrigatorio" });
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: "campo telefone obrigatorio" });
    }
    if (!endereco) {
        return res.status(400).json({ mensagem: "campo endereco obrigatorio" });
    }

    try {
        const usuario = await usuarioModel.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        usuario.nome = nome;
        usuario.telefone = telefone;
        usuario.endereco = endereco;

        await usuario.save();

        const usuarioAtualizado = await usuarioModel.findByPk(req.user.id, {
            attributes: { exclude: ["senha"] },
        });

        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        res.status(500).json({ mensagem: "internal server error" });
    }
};

export const buscarUsuario = async (req, res) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ mensagem: "id não fornecido" })
    }

    try {

        const usuarios = await usuarioModel.findByPk(id)
        res.status(200).json(usuarios)

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: "internal server error" });

    }
}

export const buscarTodos = async (req, res) => {
    try {

        const usuarios = await usuarioModel.findAll()
        res.status(200).json(usuarios)

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: "internal server error" });
    }
}



