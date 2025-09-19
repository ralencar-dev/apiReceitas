// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { verificarBlacklist } from "../utils/tokenBlacklist.js";

export const autenticar = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });

  if (verificarBlacklist(token)) {
    return res.status(401).json({ mensagem: "Token inválido (logout realizado)" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
};
