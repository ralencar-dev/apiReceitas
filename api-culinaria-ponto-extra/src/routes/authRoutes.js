import { Router } from "express";
import { login, logout, refreshToken, verificarToken } from "../controllers/authController.js";
import { autenticar } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", autenticar, logout);
router.post("/refresh", refreshToken);
router.get("/verificar", autenticar, verificarToken);

export default router;
