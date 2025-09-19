import { Router } from "express";
import { atualizarPerfil, buscarPerfil, buscarTodos, buscarUsuario, registroUsuario } from "../controllers/usuarioController.js";
import { autenticar } from "../middleware/authMiddleware.js";

const router = Router()

router.post('/', registroUsuario)
router.get('/perfil', autenticar, buscarPerfil)
router.put('/:id', atualizarPerfil)
router.get('/:id', buscarUsuario)
router.get('/', buscarTodos)

export default router;