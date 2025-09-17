import { atualizarChef, buscarChef, buscarTodosChefs, criarChef, deletarChef } from "../controllers/chefController.js";
import { Router } from "express";

const router = Router()

router.get('/', buscarTodosChefs);
router.post('/', criarChef)
router.get('/:id', buscarChef)
router.put('/:id', atualizarChef)
router.delete('/:id', deletarChef)

export default router;