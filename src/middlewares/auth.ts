import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token de autenticação não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    res.status(401).json({ message: "Formato de token inválido." });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
