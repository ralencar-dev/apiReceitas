import { Router } from "express";
import {
  curtirReceita,
  descurtirReceita,
  listarCurtidasUsuario,
  receitasPopulares
} from "../controllers/curtidasController.js";
import { autenticar } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/receitas/:id/curtir", autenticar, curtirReceita);
router.delete("/receitas/:id/curtir", autenticar, descurtirReceita);
router.get("/usuarios/curtidas", autenticar, listarCurtidasUsuario);

router.get("/receitas/populares", autenticar, receitasPopulares);

export default router;
