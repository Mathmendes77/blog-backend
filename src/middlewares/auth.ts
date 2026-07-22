import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../utils/jwt";

export function autenticar(req: Request, res: Response, next: NextFunction): void {
  const cabecalhoAuth = req.headers.authorization;

  if (!cabecalhoAuth) {
    res.status(401).json({ message: "Token de autenticação não fornecido." });
    return;
  }

  const [, token] = cabecalhoAuth.split(" ");

  if (!token) {
    res.status(401).json({ message: "Formato de token inválido." });
    return;
  }

  try {
    const dadosToken = verificarToken(token);
    req.usuario = dadosToken;
    next();
  } catch (erro) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
