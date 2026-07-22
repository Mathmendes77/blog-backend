import jwt from "jsonwebtoken";
import { PayloadToken } from "../types";

const SEGREDO_JWT = process.env.JWT_SECRET || "default_secret_change_me";
const EXPIRACAO_JWT = process.env.JWT_EXPIRES_IN || "1d";

export function gerarToken(payload: PayloadToken): string {
  return jwt.sign(payload, SEGREDO_JWT, { expiresIn: EXPIRACAO_JWT } as jwt.SignOptions);
}

export function verificarToken(token: string): PayloadToken {
  return jwt.verify(token, SEGREDO_JWT) as PayloadToken;
}
