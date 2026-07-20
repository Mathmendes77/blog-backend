import { Router } from "express";
import {
  listArticles,
  getArticleById,
  getArticleBanner,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import {
  listComments,
  createComment,
  deleteComment,
} from "../controllers/commentController";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

// Rotas públicas
router.get("/", listArticles);
router.get("/:id", getArticleById);
router.get("/:id/banner", getArticleBanner);
router.get("/:id/comments", listComments);

// Rotas protegidas (exigem login)
router.post("/", authMiddleware, upload.single("banner"), createArticle);
router.put("/:id", authMiddleware, upload.single("banner"), updateArticle);
router.delete("/:id", authMiddleware, deleteArticle);
router.post("/:id/comments", authMiddleware, createComment);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

export default router;
