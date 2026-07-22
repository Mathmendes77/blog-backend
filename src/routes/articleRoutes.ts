import { Router } from "express";
import {
  listarArtigos,
  buscarArtigoPorId,
  buscarBannerArtigo,
  criarArtigo,
  atualizarArtigo,
  excluirArtigo,
} from "../controllers/articleController";
import {
  listarComentarios,
  criarComentario,
  excluirComentario,
} from "../controllers/commentController";
import { autenticar } from "../middlewares/auth";
import { uploadImagem } from "../middlewares/upload";

const router = Router();

// Rotas públicas
router.get("/", listarArtigos);
router.get("/:id", buscarArtigoPorId);
router.get("/:id/banner", buscarBannerArtigo);
router.get("/:id/comments", listarComentarios);

// Rotas protegidas (exigem login)
router.post("/", autenticar, uploadImagem.single("banner"), criarArtigo);
router.put("/:id", autenticar, uploadImagem.single("banner"), atualizarArtigo);
router.delete("/:id", autenticar, excluirArtigo);
router.post("/:id/comments", autenticar, criarComentario);
router.delete("/comments/:commentId", autenticar, excluirComentario);

export default router;
