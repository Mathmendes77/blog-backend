import { Router } from "express";
import {
  listArticles,
  getArticleById,
  getArticleBanner,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

// Rotas públicas
router.get("/", listArticles);
router.get("/:id", getArticleById);
router.get("/:id/banner", getArticleBanner);

// Rotas protegidas (exigem login)
router.post("/", authMiddleware, upload.single("banner"), createArticle);
router.put("/:id", authMiddleware, upload.single("banner"), updateArticle);
router.delete("/:id", authMiddleware, deleteArticle);

export default router;
