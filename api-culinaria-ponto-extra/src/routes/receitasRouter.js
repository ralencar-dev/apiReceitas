import { atualizarReceita, buscarReceita, buscarReceitaChef, buscarTodasReceitas, cadastrarReceita, deletarReceita } from "../controllers/receitasController.js"
import { Router } from "express"
import { imageUpload } from "../middleware/imageUpload.js";

const router = Router()

router.post("/",  cadastrarReceita)
router.get('/:id', buscarReceita)
router.get('/', buscarTodasReceitas)
router.put('/:id', atualizarReceita)
router.delete('/:id', deletarReceita)
router.get('/chef/filtro', buscarReceitaChef)




export default router;