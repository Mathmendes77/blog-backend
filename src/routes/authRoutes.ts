import { Router } from "express";
import { register, login, me, updateProfile, getAvatar } from "../controllers/authController";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.put("/me", authMiddleware, upload.single("avatar"), updateProfile);
router.get("/:id/avatar", getAvatar);

export default router;
