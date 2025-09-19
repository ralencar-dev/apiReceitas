import { atualizarReceita, buscarImagemReceita, buscarReceita, buscarReceitaChef, buscarTodasReceitas, cadastrarReceita, deletarImagemReceita, deletarReceita, uploadImagemReceita } from "../controllers/receitasController.js"
import { Router } from "express"
import { imageUpload } from "../middleware/imageUpload.js";

const router = Router()

router.post("/",  cadastrarReceita)
router.get('/:id', buscarReceita)
router.get('/', buscarTodasReceitas)
router.put('/:id', atualizarReceita)
router.delete('/:id', deletarReceita)
router.get('/chef/filtro', buscarReceitaChef)

//imagem
router.post("/:id/imagem", imageUpload.single("imagem"), uploadImagemReceita);
router.get("/uploads/receitas/:filename", buscarImagemReceita);
router.delete("/:id/imagem", deletarImagemReceita);

export default router;