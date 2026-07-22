import { Router } from "express";
import {
  cadastrar,
  login,
  buscarUsuarioLogado,
  atualizarPerfil,
  buscarAvatar,
} from "../controllers/authController";
import { autenticar } from "../middlewares/auth";
import { uploadImagem } from "../middlewares/upload";

const router = Router();

router.post("/register", cadastrar);
router.post("/login", login);
router.get("/me", autenticar, buscarUsuarioLogado);
router.put("/me", autenticar, uploadImagem.single("avatar"), atualizarPerfil);
router.get("/:id/avatar", buscarAvatar);

export default router;
