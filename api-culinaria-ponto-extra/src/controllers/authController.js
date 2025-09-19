import usuarioModel from "../models/usuarioModel.js";
import jwt from "jsonwebtoken";
import { adicionarBlacklist } from "../utils/tokenBlacklist.js";

const ACCESS_TOKEN_EXPIRES = 15 * 60; 
const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60;

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await usuarioModel.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });

    const senhaValida = await usuario.validarSenha(senha);
    if (!senhaValida) return res.status(401).json({ mensagem: "Senha inválida" });

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipoUsuario: usuario.tipoUsuario,
        },
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRES
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const logout = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) adicionarBlacklist(token);
  res.status(200).json({ mensagem: "Logout realizado com sucesso" });
};

export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ mensagem: "Refresh token não fornecido" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: 15 * 60 }
    );
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ mensagem: "Refresh token inválido ou expirado" });
  }
};

export const verificarToken = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(400).json({ mensagem: "Token não fornecido" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valido: true });
  } catch (error) {
    res.status(401).json({ valido: false, mensagem: "Token inválido ou expirado" });
  }
};
