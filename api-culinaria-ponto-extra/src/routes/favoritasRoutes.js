import { Router } from "express";
import {
  adicionarFavorita,
  removerFavorita,
  listarFavoritasUsuario,
  detalhesFavorita,
  listarTodasFavoritas
} from "../controllers/favoritasController.js";
import { autenticar } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", autenticar, adicionarFavorita);
router.delete("/:id", autenticar, removerFavorita);
router.get("/", autenticar, listarFavoritasUsuario);
router.get("/:id", autenticar, detalhesFavorita);

router.get("/admin/all", autenticar, listarTodasFavoritas);

export default router;
