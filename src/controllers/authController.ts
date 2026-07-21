import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/database";
import { generateToken } from "../utils/jwt";
import { User } from "../types";

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres." });
      return;
    }

    const [existing] = await pool.query<any[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      res.status(409).json({ message: "Já existe um usuário cadastrado com este email." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query<any>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    const token = generateToken({ id: result.insertId, email });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      token,
      user: { id: result.insertId, name, email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao cadastrar usuário." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email e senha são obrigatórios." });
      return;
    }

    const [rows] = await pool.query<any[]>("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0] as User | undefined;

    if (!user) {
      res.status(401).json({ message: "Email ou senha inválidos." });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      res.status(401).json({ message: "Email ou senha inválidos." });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      message: "Login realizado com sucesso.",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao realizar login." });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query<any[]>(
      `SELECT id, name, email, created_at, (avatar_image IS NOT NULL) AS has_avatar
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao buscar usuário." });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ message: "O nome não pode ficar vazio." });
      return;
    }

    if (req.file) {
      await pool.query("UPDATE users SET name = ?, avatar_image = ?, avatar_mime = ? WHERE id = ?", [
        name.trim(),
        req.file.buffer,
        req.file.mimetype,
        userId,
      ]);
    } else {
      await pool.query("UPDATE users SET name = ? WHERE id = ?", [name.trim(), userId]);
    }

    const [rows] = await pool.query<any[]>(
      `SELECT id, name, email, created_at, (avatar_image IS NOT NULL) AS has_avatar
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({ message: "Perfil atualizado com sucesso.", user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao atualizar perfil." });
  }
}

export async function getAvatar(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [rows] = await pool.query<any[]>(
      "SELECT avatar_image, avatar_mime FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0 || !rows[0].avatar_image) {
      res.status(404).json({ message: "Avatar não encontrado." });
      return;
    }

    res.setHeader("Content-Type", rows[0].avatar_mime || "image/jpeg");
    res.send(rows[0].avatar_image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao buscar avatar." });
  }
}
